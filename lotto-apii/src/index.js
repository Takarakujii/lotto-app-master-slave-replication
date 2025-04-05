import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config.js';
import cors from 'cors';

import v1 from './routes/v1/index.js';
import './core/database.js';
import morgan from 'morgan';




const app = express();

// CORS for REST API
// app.use(cors({
//     origin: (origin, callback) => {
//         if (!origin || origin.startsWith("http://localhost:")) {
//             callback(null, true); // Allow all localhost ports
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'apikey', 'token'],
// }));

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/v1', cors(), v1);

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Server running on port: http://localhost:${port}`));