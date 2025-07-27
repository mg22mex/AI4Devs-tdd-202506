import { Request, Response } from 'express';
import { CandidateController } from '../presentation/controllers/CandidateController';
import { CandidateService } from '../application/services/CandidateService';
import { CreateCandidateRequest } from '../domain/types';

describe('CandidateController', () => {
  let candidateController: CandidateController;
  let mockCandidateService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create mock service
    mockCandidateService = {
      createCandidate: jest.fn(),
      getAllCandidates: jest.fn(),
      getCandidateById: jest.fn(),
      updateCandidate: jest.fn(),
      deleteCandidate: jest.fn(),
    };

    // Create controller with mock service
    candidateController = new CandidateController(mockCandidateService);

    // Setup mock request and response
    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe('createCandidate - Form Data Reception', () => {
    it('should successfully receive and process valid candidate form data', async () => {
      // Arrange - Valid form data
      const validFormData: CreateCandidateRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        address: '123 Main St, City',
        educations: [
          {
            institution: 'University of Technology',
            title: 'Computer Science',
            startDate: '2020-09-01',
            endDate: '2024-06-30',
          }
        ],
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Software Engineer',
            description: 'Developed web applications',
            startDate: '2024-07-01',
            endDate: null,
          }
        ],
        cv: {
          filePath: 'uploads/cv.pdf',
          fileType: 'application/pdf',
        }
      };

      const expectedCandidate = { ...validFormData, id: '1', createdAt: new Date(), updatedAt: new Date() };

      mockRequest.body = validFormData;
      mockCandidateService.createCandidate.mockResolvedValue(expectedCandidate);

      // Act
      await candidateController.createCandidate(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockCandidateService.createCandidate).toHaveBeenCalledWith(validFormData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedCandidate);
    });

    it('should validate required fields and return 400 for missing data', async () => {
      // Arrange - Invalid form data (missing required fields)
      const invalidFormData = {
        firstName: 'John',
        // Missing lastName and email
        phone: '123456789',
      };

      mockRequest.body = invalidFormData;

      // Act
      await candidateController.createCandidate(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'firstName, lastName, and email are required'
      });
      expect(mockCandidateService.createCandidate).not.toHaveBeenCalled();
    });

    it('should handle email validation and return 409 for duplicate email', async () => {
      // Arrange - Valid form data but duplicate email
      const validFormData: CreateCandidateRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        phone: '123456789',
        address: '123 Main St',
        educations: [],
        workExperiences: [],
      };

      mockRequest.body = validFormData;
      mockCandidateService.createCandidate.mockRejectedValue(new Error('A candidate with this email already exists'));

      // Act
      await candidateController.createCandidate(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'A candidate with this email already exists'
      });
    });

    it('should handle complex form data with multiple educations and work experiences', async () => {
      // Arrange - Complex form data
      const complexFormData: CreateCandidateRequest = {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        phone: '987654321',
        address: '456 Oak Ave, Town',
        educations: [
          {
            institution: 'MIT',
            title: 'Master of Science in Computer Science',
            startDate: '2018-09-01',
            endDate: '2020-05-30',
          },
          {
            institution: 'Stanford University',
            title: 'Bachelor of Science in Engineering',
            startDate: '2014-09-01',
            endDate: '2018-06-30',
          }
        ],
        workExperiences: [
          {
            company: 'Google',
            position: 'Senior Software Engineer',
            description: 'Led development of cloud infrastructure',
            startDate: '2020-06-01',
            endDate: '2023-12-31',
          },
          {
            company: 'Microsoft',
            position: 'Software Engineer',
            description: 'Developed Windows applications',
            startDate: '2018-06-01',
            endDate: '2020-05-31',
          }
        ],
        cv: {
          filePath: 'uploads/alice_cv.pdf',
          fileType: 'application/pdf',
        }
      };

      const expectedCandidate = { ...complexFormData, id: '2', createdAt: new Date(), updatedAt: new Date() };

      mockRequest.body = complexFormData;
      mockCandidateService.createCandidate.mockResolvedValue(expectedCandidate);

      // Act
      await candidateController.createCandidate(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockCandidateService.createCandidate).toHaveBeenCalledWith(complexFormData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedCandidate);
    });

    it('should handle server errors gracefully', async () => {
      // Arrange
      const validFormData: CreateCandidateRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        address: '123 Main St',
        educations: [],
        workExperiences: [],
      };

      mockRequest.body = validFormData;
      mockCandidateService.createCandidate.mockRejectedValue(new Error('Database connection failed'));

      // Act
      await candidateController.createCandidate(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database connection failed'
      });
    });
  });
}); 