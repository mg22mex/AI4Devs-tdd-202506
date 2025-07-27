export interface Education {
  id?: string;
  institution: string;
  title: string;
  startDate: Date;
  endDate?: Date | null;
  candidateId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkExperience {
  id?: string;
  company: string;
  position: string;
  description?: string | null;
  startDate: Date;
  endDate?: Date | null;
  candidateId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CV {
  id?: string;
  filePath: string;
  fileType: string;
  candidateId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Candidate {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  educations?: Education[];
  workExperiences?: WorkExperience[];
  cv?: CV | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Form data interfaces (for API input)
export interface EducationFormData {
  institution: string;
  title: string;
  startDate: string;
  endDate?: string | null;
}

export interface WorkExperienceFormData {
  company: string;
  position: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
}

export interface CVFormData {
  filePath: string;
  fileType: string;
}

export interface CreateCandidateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  educations?: EducationFormData[];
  workExperiences?: WorkExperienceFormData[];
  cv?: CVFormData;
}

export interface UpdateCandidateRequest extends Partial<CreateCandidateRequest> {
  id: string;
} 