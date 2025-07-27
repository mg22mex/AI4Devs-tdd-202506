import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              LTI Talent Tracking
            </h1>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Candidates
            </Link>
            <Link
              to="/candidates/new"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Candidate</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 