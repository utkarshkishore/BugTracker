import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ProjectBoard = () => {
  const { id } = useParams();
  const [tickets, setTickets] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do', priority: 'Medium' });

  // Fetch Tickets
  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:5001/api/tickets/project/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setTickets(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTickets();
  }, [id]);

  const onChange = (e) => setNewTask({ ...newTask, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5001/api/tickets', { ...newTask, projectId: id }, {
        headers: { 'x-auth-token': token }
      });
      setTickets([...tickets, res.data]);
      setNewTask({ title: '', description: '', status: 'To Do', priority: 'Medium' });
    } catch (err) {
      console.error(err);
    }
  };

  // --- DRAG AND DROP LOGIC ---
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // 1. If dropped outside or in same place, do nothing
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // 2. Optimistically update UI (make it look fast)
    const movedTicket = tickets.find(t => t._id === draggableId);
    const updatedTickets = tickets.map(t => 
      t._id === draggableId ? { ...t, status: destination.droppableId } : t
    );
    setTickets(updatedTickets);

    // 3. Send update to Backend
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5001/api/tickets/${draggableId}`, 
        { status: destination.droppableId }, 
        { headers: { 'x-auth-token': token } }
      );
    } catch (err) {
      console.error("Failed to update status", err);
      // Optional: Revert UI if backend fails
    }
  };

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Project Board</h1>
      </div>

      {/* Add Ticket Form */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <form onSubmit={onSubmit} className="flex gap-2 flex-wrap">
          <input name="title" value={newTask.title} onChange={onChange} placeholder="Task Title" className="border p-2 rounded flex-1" required />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        </form>
      </div>

      {/* Drag Drop Context */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(status => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                  className="bg-gray-200 p-4 rounded-lg min-h-[500px]"
                >
                  <h2 className="font-bold text-lg mb-4 text-gray-700">{status}</h2>
                  
                  {tickets.filter(t => t.status === status).map((ticket, index) => (
                    <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 rounded shadow mb-3 hover:shadow-md transition"
                        >
                          <h4 className="font-bold">{ticket.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                            ticket.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>{ticket.priority}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProjectBoard;