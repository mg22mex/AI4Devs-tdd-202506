import { Candidate, CreateCandidateRequest, UpdateCandidateRequest } from '../../domain/types';
import prisma from '../prisma';

export interface ICandidateRepository {
  create(data: CreateCandidateRequest): Promise<Candidate>;
  findAll(): Promise<Candidate[]>;
  findById(id: string): Promise<Candidate | null>;
  update(id: string, data: UpdateCandidateRequest): Promise<Candidate>;
  delete(id: string): Promise<void>;
}

export class CandidateRepository implements ICandidateRepository {
  async create(data: CreateCandidateRequest): Promise<Candidate> {
    const { educations, workExperiences, cv, ...candidateData } = data;
    
    const createData: any = {
      ...candidateData,
      educations: {
        create: educations?.map(edu => ({
          institution: edu.institution,
          title: edu.title,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : null,
        })) || [],
      },
      workExperiences: {
        create: workExperiences?.map(exp => ({
          company: exp.company,
          position: exp.position,
          description: exp.description || '',
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null,
        })) || [],
      },
    };

    if (cv) {
      createData.cv = {
        create: {
          filePath: cv.filePath,
          fileType: cv.fileType,
        }
      };
    }
    
    return await prisma.candidate.create({
      data: createData,
      include: {
        educations: true,
        workExperiences: true,
        cv: true,
      },
    });
  }

  async findAll(): Promise<Candidate[]> {
    return await prisma.candidate.findMany({
      include: {
        educations: true,
        workExperiences: true,
        cv: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Candidate | null> {
    return await prisma.candidate.findUnique({
      where: { id },
      include: {
        educations: true,
        workExperiences: true,
        cv: true,
      },
    });
  }

  async update(id: string, data: UpdateCandidateRequest): Promise<Candidate> {
    const { educations, workExperiences, cv, ...candidateData } = data;
    
    // Delete existing related data
    await prisma.education.deleteMany({
      where: { candidateId: id },
    });
    
    await prisma.workExperience.deleteMany({
      where: { candidateId: id },
    });
    
    await prisma.cV.deleteMany({
      where: { candidateId: id },
    });

    const updateData: any = {
      ...candidateData,
      educations: {
        create: educations?.map(edu => ({
          institution: edu.institution,
          title: edu.title,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : null,
        })) || [],
      },
      workExperiences: {
        create: workExperiences?.map(exp => ({
          company: exp.company,
          position: exp.position,
          description: exp.description || '',
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null,
        })) || [],
      },
    };

    if (cv) {
      updateData.cv = {
        create: {
          filePath: cv.filePath,
          fileType: cv.fileType,
        }
      };
    }

    return await prisma.candidate.update({
      where: { id },
      data: updateData,
      include: {
        educations: true,
        workExperiences: true,
        cv: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.candidate.delete({
      where: { id },
    });
  }
} 