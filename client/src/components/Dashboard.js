import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { API_URL } from '../apiConfig'; // <--- Import Config

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${API_URL}/projects`, { // <--- Use API_URL
        headers: { 'x-auth-token': token }
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${API_URL}/projects`, // <--- Use API_URL
        { title, description },
        { headers: { 'x-auth-token': token } }
      );
      setProjects([...projects, res.data]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <h1 className="text-3xl font-bold mb-6">Your Projects</h1>
        
        {/* Create Project Form */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Project</h2>
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Project Title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <textarea 
                placeholder="Description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Create Project
            </button>
          </form>
        </div>

        {/* Project List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="bg-white p-6 rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-bold">{project.title}</h3>
              <p className="text-gray-600 mt-2">{project.description}</p>
              <Link to={`/project/${project._id}`} className="inline-block mt-4 text-blue-600 hover:underline">
                View Board →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;