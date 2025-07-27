import { Candidate, CreateCandidateRequest, UpdateCandidateRequest } from '../../domain/types';
import { ICandidateRepository } from '../../infrastructure/repositories/CandidateRepository';

export interface ICandidateService {
  createCandidate(data: CreateCandidateRequest): Promise<Candidate>;
  getAllCandidates(): Promise<Candidate[]>;
  getCandidateById(id: string): Promise<Candidate>;
  updateCandidate(id: string, data: UpdateCandidateRequest): Promise<Candidate>;
  deleteCandidate(id: string): Promise<void>;
}

export class CandidateService implements ICandidateService {
  constructor(private candidateRepository: ICandidateRepository) {}

  async createCandidate(data: CreateCandidateRequest): Promise<Candidate> {
    // Validate email uniqueness
    const existingCandidate = await this.candidateRepository.findAll();
    const emailExists = existingCandidate.some(candidate => candidate.email === data.email);
    
    if (emailExists) {
      throw new Error('A candidate with this email already exists');
    }

    return await this.candidateRepository.create(data);
  }

  async getAllCandidates(): Promise<Candidate[]> {
    return await this.candidateRepository.findAll();
  }

  async getCandidateById(id: string): Promise<Candidate> {
    const candidate = await this.candidateRepository.findById(id);
    
    if (!candidate) {
      throw new Error('Candidate not found');
    }

    return candidate;
  }

  async updateCandidate(id: string, data: UpdateCandidateRequest): Promise<Candidate> {
    // Check if candidate exists
    const existingCandidate = await this.candidateRepository.findById(id);
    if (!existingCandidate) {
      throw new Error('Candidate not found');
    }

    // If email is being updated, check for uniqueness
    if (data.email && data.email !== existingCandidate.email) {
      const allCandidates = await this.candidateRepository.findAll();
      const emailExists = allCandidates.some(candidate => 
        candidate.email === data.email && candidate.id !== id
      );
      
      if (emailExists) {
        throw new Error('A candidate with this email already exists');
      }
    }

    return await this.candidateRepository.update(id, data);
  }

  async deleteCandidate(id: string): Promise<void> {
    const candidate = await this.candidateRepository.findById(id);
    
    if (!candidate) {
      throw new Error('Candidate not found');
    }

    await this.candidateRepository.delete(id);
  }
} 