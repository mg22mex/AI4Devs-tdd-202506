import { Request, Response } from 'express';
import { ICandidateService } from '../../application/services/CandidateService';
import { CreateCandidateRequest, UpdateCandidateRequest } from '../../domain/types';

export class CandidateController {
  constructor(private candidateService: ICandidateService) {}

  async createCandidate(req: Request, res: Response): Promise<void> {
    try {
      const candidateData: CreateCandidateRequest = req.body;
      
      // Basic validation
      if (!candidateData.firstName || !candidateData.lastName || !candidateData.email) {
        res.status(400).json({ 
          error: 'firstName, lastName, and email are required' 
        });
        return;
      }

      const candidate = await this.candidateService.createCandidate(candidateData);
      res.status(201).json(candidate);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          res.status(409).json({ error: error.message });
        } else {
          res.status(500).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getAllCandidates(req: Request, res: Response): Promise<void> {
    try {
      const candidates = await this.candidateService.getAllCandidates();
      res.status(200).json(candidates);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch candidates' });
    }
  }

  async getCandidateById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ error: 'Candidate ID is required' });
        return;
      }

      const candidate = await this.candidateService.getCandidateById(id);
      res.status(200).json(candidate);
    } catch (error) {
      if (error instanceof Error && error.message === 'Candidate not found') {
        res.status(404).json({ error: 'Candidate not found' });
      } else {
        res.status(500).json({ error: 'Failed to fetch candidate' });
      }
    }
  }

  async updateCandidate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ error: 'Candidate ID is required' });
        return;
      }

      const updateData: UpdateCandidateRequest = { ...req.body, id };
      
      const candidate = await this.candidateService.updateCandidate(id, updateData);
      res.status(200).json(candidate);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Candidate not found') {
          res.status(404).json({ error: 'Candidate not found' });
        } else if (error.message.includes('already exists')) {
          res.status(409).json({ error: error.message });
        } else {
          res.status(500).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteCandidate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ error: 'Candidate ID is required' });
        return;
      }

      await this.candidateService.deleteCandidate(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Candidate not found') {
        res.status(404).json({ error: 'Candidate not found' });
      } else {
        res.status(500).json({ error: 'Failed to delete candidate' });
      }
    }
  }
} 