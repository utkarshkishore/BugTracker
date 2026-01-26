import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus } from 'react-icons/fa'; // Icons
import Navbar from './Navbar';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5001/api/projects', {
          headers: { 'x-auth-token': token }
        });
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5001/api/projects', { title, description }, {
        headers: { 'x-auth-token': token }
      });
      setProjects([res.data, ...projects]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProject = async (id) => {
    if(!window.confirm("Are you sure? This will delete the project.")) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5001/api/projects/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setProjects(projects.filter(project => project._id !== id));
    } catch (err) {
      console.error("Error deleting project", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Projects</h1>

        {/* Create Project Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
             <FaPlus className="text-blue-600"/> Create New Project
          </h2>
          <form onSubmit={onSubmit} className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded flex-1"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold">
              Create
            </button>
          </form>
        </div>

        {/* Project List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition relative group">
              <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description || "No description"}</p>
                  </div>
                  <button 
                    onClick={() => deleteProject(project._id)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-2"
                  >
                    <FaTrash />
                  </button>
              </div>
              <Link to={`/project/${project._id}`} className="block text-center bg-blue-50 text-blue-600 font-semibold py-2 rounded mt-2 hover:bg-blue-100">
                Open Board →
              </Link>
            </div>
          ))}
        </div>
        
        {projects.length === 0 && (
            <p className="text-center text-gray-500 mt-8">No projects yet. Create one above!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;