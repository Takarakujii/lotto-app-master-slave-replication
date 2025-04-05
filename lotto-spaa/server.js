import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { Server } from 'socket.io';
import { io as client_io } from 'socket.io-client';
import { fetchPotAmount } from './src/service/FetchPot.js';
import { placeBet } from './src/service/BetService.js'
import axios from 'axios';
import { fetchLastWinningNumber } from './src/service/DrawService.js';

const API_BASE_URL = 'http://localhost:9000/v1';
const PRIMARY = 3000;
const isPRIMARY = process.env.PORT == PRIMARY;
const IS_PRODUCTION = process.env.ENV === 'production';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const countdownState = {
  countdown: 60,
  interval: null,
  io: null,
  slaves: new Set(),
  latestPot: null,
  lastDraw: null,
};

// Fetch latest pot amount
async function fetchPot() {
  try {
    const response = await fetchPotAmount();
    if (!response.data?.success) throw new Error("Failed to fetch pot amount");
    return response.data.potAmount || 0;
  } catch (error) {
    console.error("❌ Error fetching pot:", error);
    return 0;
  }
}


async function fetchLastDraw(token) {
  try {

    const response = await axios.get(`${API_BASE_URL}/draw/last`, {
      headers: {
        apikey: "hotdog",
        "Content-Type": "application/json",
        token: `${token}`,
      },
      withCredentials: true
    });

    // console.log("📄 Last draw API resxponse:", response.data);
    // console.log("winning", response.data.winning_number )
    if (!response.data?.success) {
      throw new Error("Failed to fetch draw");
    }

    return response.data.winning_number;
  } catch (error) {
    // console.error("❌ Error fetching draw:", error);
    return null;
  }
}

// Countdown function
const startCountdown = () => {
  if (countdownState.interval || !isPRIMARY) return;

  countdownState.interval = setInterval(async () => {
    if (countdownState.countdown > 0) {
      countdownState.countdown--;
    } else {
      clearInterval(countdownState.interval);
      countdownState.interval = null;
      countdownState.countdown = 60;

      startCountdown();
    }

    // Fetch latest pot amount and update clients
    const potAmount = await fetchPot();
    countdownState.latestPot = { amount: potAmount };
    countdownState.io.emit("Pot", { amount: potAmount });

    const winning_number = await fetchLastDraw(null);
    countdownState.lastDraw = { winning_num: winning_number };
    countdownState.io.emit("Lastdraw", { winning_num: winning_number });

    countdownState.io.emit("countdownUpdate", countdownState.countdown);
    countdownState.slaves.forEach(slave => slave.emit("countdownUpdate", countdownState.countdown));

  }, 1000);
};






// Server setup
async function createCustomServer() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server);

  if (!countdownState.io) countdownState.io = io;

  let primarySocket;
  if (!isPRIMARY) {
    primarySocket = client_io(`http://localhost:${PRIMARY}`);

    primarySocket.on("countdownUpdate", (countdown) => {
      countdownState.countdown = countdown;
      countdownState.io.emit("countdownUpdate", countdown);
    });

    primarySocket.on("Pot", (potData) => {
      countdownState.latestPot = potData;
      countdownState.io.emit("Pot", potData);
    });

    primarySocket.emit("requestPot");

    primarySocket.on("Lastdraw", (drawData) => {
      countdownState.lastDraw = drawData;
      countdownState.io.emit("Lastdraw", drawData);
    })


    primarySocket.emit("requestdraw");

    io.on('connection', (socket) => {
      socket.on("requestBet", async (data) => {
        const { betNumber, token } = data;
        primarySocket.emit("requestBet", { betNumber, token });
      });

      socket.on("requestdraw", async (data) => {
        // console.log("Slave receive requestdraw with data:", data);
        // Forward token from client to primary
        primarySocket.emit("requestdraw", data);
      });
    });


    console.log(`✅ Slave connected to Primary at ${PRIMARY}`);
  }

  let vite;
  if (IS_PRODUCTION) {
    app.use(express.static(path.resolve(__dirname, './dist/client/'), { index: false }));
  } else {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      build: { ssr: true, ssrEmitAssets: true }
    });
    app.use(vite.middlewares);
  }

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const index = fs.readFileSync(
        path.resolve(__dirname, IS_PRODUCTION ? './dist/client/index.html' : './index.html'),
        'utf-8'
      );

      let render, template;
      if (IS_PRODUCTION) {
        template = index;
        render = (await import('./dist/server/server-entry.js')).render;
      } else {
        template = await vite.transformIndexHtml(url, index);
        render = (await vite.ssrLoadModule('/src/server-entry.jsx')).render;
      }

      const context = {};
      const appHtml = render(url, context);
      const html = template.replace('<!-- ssr -->', appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      next(e);
    }
  });

  // Handle WebSocket connections
  io.on('connection', (socket) => {
    console.log(`🔗 User connected: ${socket.id} on port ${process.env.PORT}`);

    if (isPRIMARY) {
      countdownState.slaves.add(socket);
      socket.emit('countdownUpdate', countdownState.countdown);

      socket.on("requestPot", async () => {
        if (countdownState.latestPot) {
          socket.emit("Pot", countdownState.latestPot);
        }
      });

      socket.on("requestdraw", async (data) => {
        // console.log("Received requestdraw with data:", data);
        try {
          // If we already have last draw data,then send that s
          if (countdownState.lastDraw) {
            socket.emit("Lastdraw", countdownState.lastDraw);
          }
          if (data && data.token) {
            // console.log("Fetching last draw with provided token");
            const winningNumber = await fetchLastDraw(data.token);
            if (winningNumber) {
              countdownState.lastDraw = { winning_num: winningNumber };
              // Send updated data back to the clieeentttttttttttt
              socket.emit("Lastdraw", countdownState.lastDraw);
            }
          }
        } catch (err) {
          console.error("Error handling requestdraw:", err);
        }
      });

      socket.on("requestBet", async (data) => {
        const { betNumber, token } = data;
        const response = await placeBet(betNumber, token);

        console.log(response, "laknsdlkansdkl")
        // console.log(betNumber, token, "aksndkajsdkja")
      });
    } else {
      socket.emit("countdownUpdate", countdownState.countdown);
      if (countdownState.latestPot) socket.emit("Pot", countdownState.latestPot);
      if (countdownState.lastDraw) socket.emit("Lastdraw", countdownState.lastDraw);
    }

    socket.on('disconnect', () => {
      countdownState.slaves.delete(socket);
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  if (isPRIMARY && !countdownState.interval) {
    startCountdown();
  }

  console.log(`✅ Server running on port ${process.env.PORT}`);
  server.listen(process.env.PORT);
}

createCustomServer();
