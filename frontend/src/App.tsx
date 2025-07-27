import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CandidateList from './components/CandidateList';
import CandidateForm from './components/CandidateForm';
import CandidateDetail from './components/CandidateDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<CandidateList />} />
            <Route path="/candidates/new" element={<CandidateForm />} />
            <Route path="/candidates/:id" element={<CandidateDetail />} />
            <Route path="/candidates/:id/edit" element={<CandidateForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 