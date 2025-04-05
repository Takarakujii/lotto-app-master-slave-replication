import { Router } from 'express';
import homeRouter from './homeRoutes.js';

import accountRouter from './accountRoutes.js';
import topupRouter from './topUpRoutes.js';
import betRouter from './betRoutes.js';
import drawRouter from './drawRoutes.js';
import winResultRouter from './winResultRoutes.js';
import potRouter from './potRoutes.js';


const v1 = new Router();


// account
v1.use('/account', accountRouter);
v1.use('/topup', topupRouter);
v1.use('/bet', betRouter);
v1.use('/draw', drawRouter);
v1.use('/win-result', winResultRouter);
v1.use('/pot', potRouter);


v1.use('/', homeRouter);





export default v1;