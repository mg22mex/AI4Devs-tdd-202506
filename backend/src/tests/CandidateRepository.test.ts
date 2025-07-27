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
import { CreateCandidateRequest } from '../domain/types';

describe('CandidateRepository - Database Operations', () => {
  let candidateRepository: CandidateRepository;
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    candidateRepository = new CandidateRepository();
    
    // Get the mocked prisma instance
    const prismaModule = require('../infrastructure/prisma');
    mockPrisma = prismaModule.default;
  });

  describe('create - Database Insertion', () => {
    it('should transform form data correctly for database insertion', async () => {
      // Arrange - Basic candidate data
      const candidateData: CreateCandidateRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        address: '123 Main St, City',
        educations: [],
        workExperiences: [],
      };

      const expectedDatabaseResult = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        address: '123 Main St, City',
        createdAt: new Date(),
        updatedAt: new Date(),
        educations: [],
        workExperiences: [],
        cv: null,
      };

      mockPrisma.candidate.create.mockResolvedValue(expectedDatabaseResult);

      // Act
      const result = await candidateRepository.create(candidateData);

      // Assert
      expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
        data: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '123456789',
          address: '123 Main St, City',
          educations: {
            create: [],
          },
          workExperiences: {
            create: [],
          },
        },
        include: {
          educations: true,
          workExperiences: true,
          cv: true,
        },
      });
      expect(result).toEqual(expectedDatabaseResult);
    });

    it('should transform education data from strings to Date objects', async () => {
      // Arrange - Candidate with education
      const candidateData: CreateCandidateRequest = {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        phone: '987654321',
        address: '456 Oak Ave',
        educations: [
          {
            institution: 'MIT',
            title: 'Master of Science in Computer Science',
            startDate: '2018-09-01',
            endDate: '2020-05-30',
          }
        ],
        workExperiences: [],
      };

      const expectedDatabaseResult = {
        id: '2',
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        phone: '987654321',
        address: '456 Oak Ave',
        createdAt: new Date(),
        updatedAt: new Date(),
        educations: [
          {
            id: 'edu1',
            institution: 'MIT',
            title: 'Master of Science in Computer Science',
            startDate: new Date('2018-09-01'),
            endDate: new Date('2020-05-30'),
            candidateId: '2',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ],
        workExperiences: [],
        cv: null,
      };

      mockPrisma.candidate.create.mockResolvedValue(expectedDatabaseResult);

      // Act
      const result = await candidateRepository.create(candidateData);

      // Assert - Check that string dates are converted to Date objects
      const createCall = mockPrisma.candidate.create.mock.calls[0][0];
      expect(createCall.data.educations.create[0].startDate).toBeInstanceOf(Date);
      expect(createCall.data.educations.create[0].endDate).toBeInstanceOf(Date);
      expect(createCall.data.educations.create[0].startDate.getTime()).toBe(new Date('2018-09-01').getTime());
      expect(createCall.data.educations.create[0].endDate.getTime()).toBe(new Date('2020-05-30').getTime());
    });

    it('should transform work experience data from strings to Date objects', async () => {
      // Arrange - Candidate with work experience
      const candidateData: CreateCandidateRequest = {
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob.smith@example.com',
        phone: '555123456',
        address: '789 Pine St',
        educations: [],
        workExperiences: [
          {
            company: 'Google',
            position: 'Senior Software Engineer',
            description: 'Led development of cloud infrastructure',
            startDate: '2020-06-01',
            endDate: '2023-12-31',
          }
        ],
      };

      const expectedDatabaseResult = {
        id: '3',
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob.smith@example.com',
        phone: '555123456',
        address: '789 Pine St',
        createdAt: new Date(),
        updatedAt: new Date(),
        educations: [],
        workExperiences: [
          {
            id: 'exp1',
            company: 'Google',
            position: 'Senior Software Engineer',
            description: 'Led development of cloud infrastructure',
            startDate: new Date('2020-06-01'),
            endDate: new Date('2023-12-31'),
            candidateId: '3',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ],
        cv: null,
      };

      mockPrisma.candidate.create.mockResolvedValue(expectedDatabaseResult);

      // Act
      const result = await candidateRepository.create(candidateData);

      // Assert - Check that string dates are converted to Date objects
      const createCall = mockPrisma.candidate.create.mock.calls[0][0];
      expect(createCall.data.workExperiences.create[0].startDate).toBeInstanceOf(Date);
      expect(createCall.data.workExperiences.create[0].endDate).toBeInstanceOf(Date);
      expect(createCall.data.workExperiences.create[0].startDate.getTime()).toBe(new Date('2020-06-01').getTime());
      expect(createCall.data.workExperiences.create[0].endDate.getTime()).toBe(new Date('2023-12-31').getTime());
    });

    it('should handle CV data correctly when provided', async () => {
      // Arrange - Candidate with CV
      const candidateData: CreateCandidateRequest = {
        firstName: 'Carol',
        lastName: 'Wilson',
        email: 'carol.wilson@example.com',
        phone: '444555666',
        address: '321 Elm St',
        educations: [],
        workExperiences: [],
        cv: {
          filePath: 'uploads/carol_cv.pdf',
          fileType: 'application/pdf',
        }
      };

      const expectedDatabaseResult = {
        id: '4',
        firstName: 'Carol',
        lastName: 'Wilson',
        email: 'carol.wilson@example.com',
        phone: '444555666',
        address: '321 Elm St',
        createdAt: new Date(),
        updatedAt: new Date(),
        educations: [],
        workExperiences: [],
        cv: {
          id: 'cv1',
          filePath: 'uploads/carol_cv.pdf',
          fileType: 'application/pdf',
          candidateId: '4',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      };

      mockPrisma.candidate.create.mockResolvedValue(expectedDatabaseResult);

      // Act
      const result = await candidateRepository.create(candidateData);

      // Assert - Check that CV data is included in the create call
      const createCall = mockPrisma.candidate.create.mock.calls[0][0];
      expect(createCall.data.cv).toBeDefined();
      expect(createCall.data.cv.create.filePath).toBe('uploads/carol_cv.pdf');
      expect(createCall.data.cv.create.fileType).toBe('application/pdf');
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const candidateData: CreateCandidateRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        address: '123 Main St',
        educations: [],
        workExperiences: [],
      };

      const databaseError = new Error('Database connection failed');
      mockPrisma.candidate.create.mockRejectedValue(databaseError);

      // Act & Assert
      await expect(candidateRepository.create(candidateData))
        .rejects
        .toThrow('Database connection failed');
    });
  });
}); 