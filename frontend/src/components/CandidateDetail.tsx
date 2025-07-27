import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Building, GraduationCap, Briefcase } from 'lucide-react';
import { Candidate } from '../types';
import { candidateApi } from '../services/api';

const CandidateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCandidate();
    }
  }, [id]);

  const fetchCandidate = async () => {
    try {
      setLoading(true);
      const data = await candidateApi.getById(id!);
      setCandidate(data);
    } catch (err) {
      setError('Failed to fetch candidate');
      console.error('Error fetching candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error || 'Candidate not found'}</p>
        <button 
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Back to Candidates
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Candidates
        </button>
        <Link
          to={`/candidates/${candidate.id}/edit`}
          className="btn-primary flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Edit Candidate</span>
        </Link>
      </div>

      {/* Basic Information */}
      <div className="card mb-6">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 text-2xl font-bold">
                {candidate.firstName[0]}{candidate.lastName[0]}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {candidate.firstName} {candidate.lastName}
            </h1>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {candidate.email}
              </div>
              {candidate.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {candidate.phone}
                </div>
              )}
              {candidate.address && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {candidate.address}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work Experience */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Briefcase className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
          </div>
          
          {candidate.workExperiences && candidate.workExperiences.length > 0 ? (
            <div className="space-y-4">
              {candidate.workExperiences.map((experience, index) => (
                <div key={index} className="border-l-4 border-primary-200 pl-4">
                  <h3 className="font-medium text-gray-900">{experience.position}</h3>
                  <p className="text-gray-600 mb-1">{experience.company}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(experience.startDate)}
                    {experience.endDate && (
                      <>
                        <span className="mx-1">-</span>
                        {formatDate(experience.endDate)}
                      </>
                    )}
                  </div>
                  {experience.description && (
                    <p className="text-gray-600 text-sm">{experience.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No work experience listed</p>
          )}
        </div>

        {/* Education */}
        <div className="card">
          <div className="flex items-center mb-4">
            <GraduationCap className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Education</h2>
          </div>
          
          {candidate.educations && candidate.educations.length > 0 ? (
            <div className="space-y-4">
              {candidate.educations.map((education, index) => (
                <div key={index} className="border-l-4 border-primary-200 pl-4">
                  <h3 className="font-medium text-gray-900">{education.title}</h3>
                  <p className="text-gray-600 mb-1">{education.institution}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(education.startDate)}
                    {education.endDate && (
                      <>
                        <span className="mx-1">-</span>
                        {formatDate(education.endDate)}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No education listed</p>
          )}
        </div>
      </div>

      {/* CV Section */}
      {candidate.cv && (
        <div className="card mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">CV</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 font-medium">CV</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">File: {candidate.cv.filePath}</p>
              <p className="text-sm text-gray-500">Type: {candidate.cv.fileType}</p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="card mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Created</p>
            <p className="text-sm text-gray-600">
              {candidate.createdAt ? formatDate(candidate.createdAt) : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Last Updated</p>
            <p className="text-sm text-gray-600">
              {candidate.updatedAt ? formatDate(candidate.updatedAt) : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail; 