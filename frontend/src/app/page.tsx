// ./src/app/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  name: string;
  email: string;
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  skills: string;
  qualifications: string;
  reactJsExperience: number;
  nodeJsExperience: number;
  status: string;
  expectedSalary: number;
  computedScore: number;
}

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMeModalOpen, setMeModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  useEffect(() => {
    const fetchUser = async () => {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        setUser(JSON.parse(storedUserData));
        setLoginModalOpen(false);
      }
    };
    fetchUser();
  }, []);

  const openMeModal = () => {
    setMeModalOpen(true);
  };

  const closeMeModal = () => {
    setMeModalOpen(false);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', loginData);
      const userData = response.data;
      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify(userData));

      setUser(userData);
      closeLoginModal();
    } catch (error: any) {
      console.error('Error during login:', error);
      // Handle login error
      if (error.response && error.response.status === 401) {
        // Invalid credentials
        alert('Invalid credentials. Please check your email and password.');
      } else {
        // Other errors
        alert('An error occurred during login. Please try again later.');
      }
    }
  };

  const handleLogout = async () => {
    try {

      setUser(null);
      closeMeModal();
      // Show the login modal after logout
      openLoginModal();

      // Clear user data from localStorage
      localStorage.removeItem('userData');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [candidateData, setCandidateData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    qualifications: '',
    reactJsExperience: 0,
    nodeJsExperience: 0,
    status: '',
    expectedSalary: 0,
    computedScore: 0,
  });
  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };
  const handleAddCandidate = async (e: React.FormEvent) => {
    try {

      const response = await axios.post('http://localhost:3001/candidates', candidateData);

      closeAddModal();

    } catch (error) {
      console.error('Error adding candidate:', error);
      alert('An error occurred while adding the candidate. Please try again later.');
    }
  };

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/candidates');
        const transformedCandidates = response.data.map((backendCandidate: any) => ({
          ...backendCandidate,
          reactJsExperience: backendCandidate.reactjs_experience,
          nodeJsExperience: backendCandidate.nodejs_experience,
          expectedSalary: backendCandidate.expected_salary,
          computedScore: 0,
        }));

        for (const candidate of transformedCandidates) {
          const { reactJsExperience, nodeJsExperience } = candidate;
          if (reactJsExperience > 2) candidate.computedScore += 3;
          else if (reactJsExperience >= 1) candidate.computedScore += 2;
          else candidate.computedScore += 1;
          if (nodeJsExperience > 2) candidate.computedScore += 3;
          else if (nodeJsExperience >= 1) candidate.computedScore += 2;
          else candidate.computedScore += 1;
        }

        setCandidates(transformedCandidates);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchData();
  }, []);

  const [isUpdateFormOpen, setUpdateFormOpen] = useState(false);
  const [activeCandidateId, setActiveCandidateId] = useState(0);

  const toggleUpdateForm = (candidateId: number) => {
    setUpdateFormOpen(!isUpdateFormOpen);
    setActiveCandidateId(candidateId);
  };
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await axios.put(`http://localhost:3001/candidates/${id}`, { status: newStatus });
      if (response.status === 200) {
        const updatedCandidates = candidates.map((candidate) =>
          candidate.id === id ? { ...candidate, status: newStatus } : candidate
        );
        setCandidates(updatedCandidates);
        console.log('Candidate status updated successfully');
        toggleUpdateForm(id);
      } else {
        alert('An error occurred while updating the candidate. Please try again later.');
        console.error('Error updating candidate status');
      }
    } catch (error) {
      alert('An error occurred while updating the candidate. Please try again later.');
      console.error('Error updating candidate status:', error);
    }
  };


  const handleDeleteCandidate = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:3001/candidates/${id}`);
      if (response.status === 200) {
        const updatedCandidates = candidates.filter((candidate) => candidate.id !== id);
        setCandidates(updatedCandidates);
        console.log('Candidate deleted successfully');
      } else {
        console.error('Error deleting candidate');
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-2xl mb-4">Login</h2>
            <form>
              <label className="block">
                Email:
                <input
                  type="email"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </label>
              <label className="block mt-4">
                Password:
                <input
                  type="password"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </label>
              <button
                type="button"
                onClick={handleLogin}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Header */}
      {!isLoginModalOpen && (
        <div>
          <header className="bg-blue-500 text-white p-4 flex justify-end items-center">
            <button className="bg-red-500 text-white p-2 rounded-full cursor-pointer" onClick={openMeModal}>
              Me
            </button>
          </header>

          {/* Me Modal */}
          {isMeModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-md">
                <p>Name: {user?.name}</p>
                <p>Email: {user?.email}</p>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md mt-4">
                  Logout
                </button>
                <button onClick={closeMeModal} className="mt-4 mx-10 text-gray-500">
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Add Candidate Button */}
          <div className="text-center mt-4">
            <button
              onClick={openAddModal}
              className="bg-green-500 text-white px-4 py-2 rounded-md">
              Add Candidate
            </button>
          </div>

          {isAddModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-md grid grid-cols-2 gap-4">
                <form onSubmit={handleAddCandidate} className="col-span-2">
                  <label className="block">
                    Candidate Name:
                    <input
                      type="text"
                      name="name"
                      value={candidateData.name}
                      onChange={(e) => setCandidateData({ ...candidateData, name: e.target.value })}
                      required
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </label>

                  <div className="flex flex-wrap -mx-4">
                    <div className="w-full md:w-1/2 px-4 mb-4">
                      <label className="block">
                        Email:
                        <input
                          type="text"
                          name="email"
                          value={candidateData.email}
                          onChange={(e) => setCandidateData({ ...candidateData, email: e.target.value })}
                          required
                          className="mt-1 p-2 w-full border rounded-md"
                        />
                      </label>
                    </div>
                    <div className="w-full md:w-1/2 px-4 mb-4">
                      <label className="block">
                        Phone:
                        <input
                          type="text"
                          name="phone"
                          value={candidateData.phone}
                          onChange={(e) => setCandidateData({ ...candidateData, phone: e.target.value })}
                          required
                          className="mt-1 p-2 w-full border rounded-md"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap -mx-4">
                    <div className="w-full md:w-1/2 px-4 mb-4">
                      <label className="block">
                        Skills:
                        <input
                          type="text"
                          name="skills"
                          value={candidateData.skills}
                          onChange={(e) => setCandidateData({ ...candidateData, skills: e.target.value })}
                          required
                          className="mt-1 p-2 w-full border rounded-md"
                        />
                      </label>
                    </div>
                    <div className="w-full md:w-1/2 px-4 mb-4">
                      <label className="block">
                        Qualifications:
                        <input
                          type="text"
                          name="qualifications"
                          value={candidateData.qualifications}
                          onChange={(e) => setCandidateData({ ...candidateData, qualifications: e.target.value })}
                          required
                          className="mt-1 p-2 w-full border rounded-md"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap -mx-4">
                    <div className="w-full md:w-1/2 px-4 mb-4">
                      <label className="block">
                        ReactJS Experience:
                        <input
                          type="number"
                          name="reactJsExperience"
                          value={candidateData.reactJsExperience}
                          onChange={(e) => setCandidateData({ ...candidateData, reactJsExperience: Number(e.target.value) })}
                          required
                          className="mt-1 p-2 w-full border rounded-md"
                        />
                      </label>
                    </div>
                    <div className="w-full md:w-1/2 px-4 mb-4">
                      <label className="block">
                        NodeJS Experience:
                        <input
                          type="number"
                          name="nodeJsExperience"
                          value={candidateData.nodeJsExperience}
                          onChange={(e) => setCandidateData({ ...candidateData, nodeJsExperience: Number(e.target.value) })}
                          required
                          className="mt-1 p-2 w-full border rounded-md"
                        />
                      </label>
                    </div>
                  </div>
                  <label className="block">
                    Current Status:
                    <select
                      name="status"
                      value={candidateData.status}
                      onChange={(e) => setCandidateData({ ...candidateData, status: e.target.value })}
                      required
                      className="mt-1 p-2 w-full border rounded-md"
                    >
                      <option value="">Select Status</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Offer Extended">Offer Extended</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </label>
                  <label className="block">
                    Expected Salary:
                    <input
                      type="number"
                      name="expectedSalary"
                      value={candidateData.expectedSalary}
                      onChange={(e) => setCandidateData({ ...candidateData, expectedSalary: Number(e.target.value) })}
                      required
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </label>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      Add Candidate
                    </button>
                    <button
                      type="button"
                      onClick={closeAddModal}
                      className="ml-4 text-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Candidate List */}
          <div className="mt-10 mx-20">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="border p-4 mb-4 rounded flex items-center justify-between">
                {/* Candidate details */}
                <div className="mx-10 flex-grow pr-4">
                  <p className="mb-2 text-xl font-semibold">{candidate.name}</p>
                  <div className="text-gray-600">
                    <p>Email: {candidate.email}</p>
                    <p>Phone: {candidate.phone}</p>
                    <p>Skills: {candidate.skills}</p>
                    <p>qualifications: {candidate.qualifications}</p>
                    <p>ReactJS Experience: {candidate.reactJsExperience}</p>
                    <p>NodeJS Experience: {candidate.nodeJsExperience}</p>
                    <p>Status: {candidate.status}</p>
                    <p>Expected Salary: ${candidate.expectedSalary}</p>
                    <p>Computed Score: {candidate.computedScore}</p>
                  </div>
                </div>
                {/* Update and delete buttons */}
                <div className="mt-10 mx-10 flex items-center spacex-10">
                  <div className="relative">
                    {isUpdateFormOpen && candidate.id === activeCandidateId && (
                      <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                          {/* Mapping through the status options */}
                          {['Contacted', 'Interview Scheduled', 'Offer Extended', 'Hired', 'Rejected'].map((statusOption) => (
                            <div key={statusOption} onClick={() => handleUpdateStatus(candidate.id, statusOption)}>
                              <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer">
                                {statusOption}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => toggleUpdateForm(candidate.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded-md"
                  >
                    Update
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteCandidate(candidate.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md ml-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Footer */}
      <footer className="bg-gray-200 text-gray-600 p-4 text-center mt-auto">
        © 2024 Hiring Manager
      </footer>
    </div>
  );
};

export default Home;
