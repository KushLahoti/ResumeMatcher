import express from 'express'
import { getAllHrMatchResults, getOneHrMatchResults, uploadAndMatchResumesToJD } from '../controllers/hr.controller';
const hrRouter = express.Router();
hrRouter.get('/history',getAllHrMatchResults);
hrRouter.get('/history/:id',getOneHrMatchResults);
hrRouter.post('/upload',uploadAndMatchResumesToJD);

export default hrRouter