import { CandidateService } from '../application/services/CandidateService';
import { CreateCandidateRequest } from '../domain/types';

describe('CandidateService', () => {
  let mockRepository: any;
  let candidateService: CandidateService;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    candidateService = new CandidateService(mockRepository);
  });

  describe('createCandidate', () => {
    it('should create a candidate successfully', async () => {
      const candidateData: CreateCandidateRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        address: '123 Main St',
        educations: [],
        workExperiences: [],
      };

      const expectedCandidate = { ...candidateData, id: '1' };
      mockRepository.create.mockResolvedValue(expectedCandidate);
      mockRepository.findAll.mockResolvedValue([]);

      const result = await candidateService.createCandidate(candidateData);

      expect(mockRepository.create).toHaveBeenCalledWith(candidateData);
      expect(result).toEqual(expectedCandidate);
    });

    it('should throw error if email already exists', async () => {
      const candidateData: CreateCandidateRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        address: '123 Main St',
        educations: [],
        workExperiences: [],
      };

      const existingCandidate = { ...candidateData, id: '1' };
      mockRepository.findAll.mockResolvedValue([existingCandidate]);

      await expect(candidateService.createCandidate(candidateData))
        .rejects
        .toThrow('A candidate with this email already exists');
    });
  });

  describe('getAllCandidates', () => {
    it('should return all candidates', async () => {
      const candidates = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
      ];

      mockRepository.findAll.mockResolvedValue(candidates);

      const result = await candidateService.getAllCandidates();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(candidates);
    });
  });

  describe('getCandidateById', () => {
    it('should return candidate if found', async () => {
      const candidate = { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      mockRepository.findById.mockResolvedValue(candidate);

      const result = await candidateService.getCandidateById('1');

      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(candidate);
    });

    it('should throw error if candidate not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(candidateService.getCandidateById('999'))
        .rejects
        .toThrow('Candidate not found');
    });
  });

  describe('deleteCandidate', () => {
    it('should delete candidate if found', async () => {
      const candidate = { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      mockRepository.findById.mockResolvedValue(candidate);
      mockRepository.delete.mockResolvedValue(undefined);

      await candidateService.deleteCandidate('1');

      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw error if candidate not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(candidateService.deleteCandidate('999'))
        .rejects
        .toThrow('Candidate not found');
    });
  });
}); 