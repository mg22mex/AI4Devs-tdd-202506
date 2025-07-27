import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';
import { Candidate, CreateCandidateRequest, Education, WorkExperience } from '../types';
import { candidateApi } from '../services/api';

const CandidateForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<CreateCandidateRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    educations: [],
    workExperiences: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      fetchCandidate();
    }
  }, [id, isEditing]);

  const fetchCandidate = async () => {
    try {
      setLoading(true);
      const candidate = await candidateApi.getById(id!);
      setFormData({
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone || '',
        address: candidate.address || '',
        educations: candidate.educations || [],
        workExperiences: candidate.workExperiences || [],
        cv: candidate.cv,
      });
    } catch (err) {
      setError('Failed to fetch candidate');
      console.error('Error fetching candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing && id) {
        await candidateApi.update(id, formData);
      } else {
        await candidateApi.create(formData);
      }
      navigate('/');
    } catch (err) {
      setError('Failed to save candidate');
      console.error('Error saving candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateCandidateRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addEducation = () => {
    const newEducation: Omit<Education, 'id' | 'candidateId' | 'createdAt' | 'updatedAt'> = {
      institution: '',
      title: '',
      startDate: '',
      endDate: '',
    };
    setFormData(prev => ({
      ...prev,
      educations: [...(prev.educations || []), newEducation],
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setFormData(prev => ({
      ...prev,
      educations: prev.educations?.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      educations: prev.educations?.filter((_, i) => i !== index),
    }));
  };

  const addWorkExperience = () => {
    const newExperience: Omit<WorkExperience, 'id' | 'candidateId' | 'createdAt' | 'updatedAt'> = {
      company: '',
      position: '',
      description: '',
      startDate: '',
      endDate: '',
    };
    setFormData(prev => ({
      ...prev,
      workExperiences: [...(prev.workExperiences || []), newExperience],
    }));
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string) => {
    setFormData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences?.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeWorkExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences?.filter((_, i) => i !== index),
    }));
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Candidates
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Candidate' : 'Add New Candidate'}
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Education</h3>
            <button
              type="button"
              onClick={addEducation}
              className="btn-secondary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              Add Education
            </button>
          </div>
          
          {formData.educations?.map((education, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution *
                  </label>
                  <input
                    type="text"
                    required
                    value={education.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={education.title}
                    onChange={(e) => updateEducation(index, 'title', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={education.startDate}
                    onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={education.endDate || ''}
                    onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Work Experience */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
            <button
              type="button"
              onClick={addWorkExperience}
              className="btn-secondary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              Add Experience
            </button>
          </div>
          
          {formData.workExperiences?.map((experience, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeWorkExperience(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={experience.company}
                    onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={experience.position}
                    onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={experience.startDate}
                    onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={experience.endDate || ''}
                    onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={experience.description || ''}
                    onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                    rows={3}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm; 