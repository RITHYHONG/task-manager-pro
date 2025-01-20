import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../utils/axios';
import { addTask, updateTask } from '../../store/slices/taskSlice';

const TaskForm = ({ task, onSuccess }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.auth.user);
  const [formData, setFormData] = useState(task || {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!user?.uid) {
        throw new Error('Please login first');
      }

      let result;
      if (task?._id) {
        result = await api.put(`/tasks/${task._id}`, formData);
        dispatch(updateTask(result.data));
      } else {
        result = await api.post('/tasks', formData);
        dispatch(addTask(result.data));
      }
      
      if (onSuccess) {
        onSuccess(result.data);
      }
    } catch (error) {
      console.error('Error saving task:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
        />
      </Form.Group>

      <Form.Group controlId="formDescription" className="mt-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
        />
      </Form.Group>

      <Form.Group controlId="formPriority" className="mt-3">
        <Form.Label>Priority</Form.Label>
        <Form.Select 
          name="priority" 
          value={formData.priority}
          onChange={handleChange}
          required
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="formStatus" className="mt-3">
        <Form.Label>Status</Form.Label>
        <Form.Select 
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </Form.Select>
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100 mt-4" disabled={loading}>
        {task ? 'Update Task' : 'Create Task'}
      </Button>
    </Form>
  );
};

export default TaskForm;
