// Mock the Prisma client (must be at the very top before imports!)
jest.mock('../infrastructure/prisma', () => {
  const mockPrisma = {
    candidate: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    education: { deleteMany: jest.fn() },
    workExperience: { deleteMany: jest.fn() },
    cV: { deleteMany: jest.fn() },
  };
  return {
    __esModule: true,
    default: mockPrisma,
    prisma: mockPrisma,
  };
});

import { CandidateRepository } from '../infrastructure/repositories/CandidateRepository';
import { CandidateController } from '../presentation/controllers/CandidateController';
import { CandidateService } from '../application/services/CandidateService';
import { CreateCandidateRequest } from '../domain/types';
import { Request, Response } from 'express';

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

  // ... (CandidateService tests here) ...
});

describe('CandidateController', () => {
  let candidateController: CandidateController;
  let mockCandidateService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCandidateService = {
      createCandidate: jest.fn(),
      getAllCandidates: jest.fn(),
      getCandidateById: jest.fn(),
      updateCandidate: jest.fn(),
      deleteCandidate: jest.fn(),
    };
    candidateController = new CandidateController(mockCandidateService);
    mockRequest = { body: {}, params: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  // ... (CandidateController tests here) ...
});

describe('CandidateRepository - Database Operations', () => {
  let candidateRepository: CandidateRepository;
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    candidateRepository = new CandidateRepository();
    const prismaModule = require('../infrastructure/prisma');
    mockPrisma = prismaModule.default;
  });

  // ... (CandidateRepository tests here) ...
}); 