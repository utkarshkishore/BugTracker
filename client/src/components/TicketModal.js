import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../apiConfig'; // <--- Import Config

const TicketModal = ({ ticket, onClose, onUpdate }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    priority: ''
  });

  useEffect(() => {
    if (ticket) {
      setEditFormData({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority
      });
      fetchComments();
    }
  }, [ticket]);

  const fetchComments = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${API_URL}/comments/${ticket._id}`, { // <--- Use API_URL
        headers: { 'x-auth-token': token }
      });
      setComments(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${API_URL}/comments/${ticket._id}`, // <--- Use API_URL
        { text: commentText }, 
        { headers: { 'x-auth-token': token } }
      );
      setComments([...comments, res.data]);
      setCommentText('');
    } catch (err) { console.error(err); }
  };

  const handleEditSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(`${API_URL}/tickets/${ticket._id}`, // <--- Use API_URL
        editFormData, 
        { headers: { 'x-auth-token': token } }
      );
      onUpdate(res.data);
      setIsEditing(false);
    } catch (err) { console.error(err); }
  };

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-start mb-4">
          {isEditing ? (
            <input 
              value={editFormData.title} 
              onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
              className="text-2xl font-bold border p-1 rounded w-full mr-2"
            />
          ) : (
            <h2 className="text-2xl font-bold">{ticket.title}</h2>
          )}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">✖</button>
        </div>

        <div className="mb-6">
           {isEditing ? (
             <div className="flex flex-col gap-2">
               <textarea 
                  value={editFormData.description} 
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  className="border p-2 rounded w-full h-24"
                  placeholder="Description"
               />
               <select 
                  value={editFormData.priority}
                  onChange={(e) => setEditFormData({...editFormData, priority: e.target.value})}
                  className="border p-2 rounded"
               >
                 <option>Low</option>
                 <option>Medium</option>
                 <option>High</option>
               </select>
               <div className="flex gap-2 mt-2">
                 <button onClick={handleEditSubmit} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                 <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
               </div>
             </div>
           ) : (
             <>
               <p className="text-gray-600 bg-gray-50 p-3 rounded mb-2">
                 {ticket.description || "No description provided."}
               </p>
               <div className="flex justify-between items-center">
                 <span className={`text-xs px-2 py-1 rounded inline-block ${
                    ticket.priority === 'High' ? 'bg-red-100 text-red-800' : 
                    ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>Priority: {ticket.priority}</span>
                 <button onClick={() => setIsEditing(true)} className="text-blue-600 text-sm hover:underline">Edit Ticket</button>
               </div>
             </>
           )}
        </div>

        <h3 className="font-bold text-lg mb-3">Comments</h3>
        <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
            {comments.map(c => (
              <div key={c._id} className="bg-blue-50 p-2 rounded text-sm">
                <div className="flex justify-between">
                    <span className="font-bold text-blue-800">{c.user?.name || "User"}</span>
                    <span className="text-gray-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{c.text}</p>
              </div>
            ))}
        </div>

        <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input 
              type="text" 
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..." 
              className="border p-2 rounded flex-1"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Post</button>
        </form>
      </div>
    </div>
  );
};

export default TicketModal;