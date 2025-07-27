import { Router, Request, Response } from 'express';
import { CandidateController } from '../presentation/controllers/CandidateController';
import { ICandidateService } from '../application/services/CandidateService';

export function createCandidateRoutes(candidateService: ICandidateService): Router {
  const router = Router();
  const candidateController = new CandidateController(candidateService);

  // POST /candidates - Create a new candidate
  router.post('/', (req: Request, res: Response) => candidateController.createCandidate(req, res));

  // GET /candidates - Get all candidates
  router.get('/', (req: Request, res: Response) => candidateController.getAllCandidates(req, res));

  // GET /candidates/:id - Get a specific candidate
  router.get('/:id', (req: Request, res: Response) => candidateController.getCandidateById(req, res));

  // PUT /candidates/:id - Update a candidate
  router.put('/:id', (req: Request, res: Response) => candidateController.updateCandidate(req, res));

  // DELETE /candidates/:id - Delete a candidate
  router.delete('/:id', (req: Request, res: Response) => candidateController.deleteCandidate(req, res));

  return router;
} 