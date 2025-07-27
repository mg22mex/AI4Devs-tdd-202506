export interface Education {
  id?: string;
  institution: string;
  title: string;
  startDate: string;
  endDate?: string;
  candidateId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkExperience {
  id?: string;
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
  candidateId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CV {
  id?: string;
  filePath: string;
  fileType: string;
  candidateId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Candidate {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  educations?: Education[];
  workExperiences?: WorkExperience[];
  cv?: CV;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCandidateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  educations?: Omit<Education, 'id' | 'candidateId' | 'createdAt' | 'updatedAt'>[];
  workExperiences?: Omit<WorkExperience, 'id' | 'candidateId' | 'createdAt' | 'updatedAt'>[];
  cv?: Omit<CV, 'id' | 'candidateId' | 'createdAt' | 'updatedAt'>;
}

export interface UpdateCandidateRequest extends Partial<CreateCandidateRequest> {
  id: string;
} 