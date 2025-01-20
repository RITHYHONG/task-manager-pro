import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setTasks, deleteTask } from '../../store/slices/taskSlice';
import axios from '../../utils/axios';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const tasks = useSelector(state => state.tasks.items);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks');
      dispatch(setTasks(response.data));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`);
      dispatch(deleteTask(id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: priority => (
        <span className={`badge ${priority === 'high' ? 'bg-danger' : priority === 'medium' ? 'bg-warning' : 'bg-success'}`}>
          {priority.toUpperCase()}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <span className={`badge ${status === 'completed' ? 'bg-success' : status === 'in_progress' ? 'bg-primary' : 'bg-secondary'}`}>
          {status.replace('_', ' ').toUpperCase()}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="d-flex z-3">
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={() => {
              setEditingTask(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button
        variant="primary"
        onClick={() => {
          setEditingTask(null);
          setIsModalVisible(true);
        }}
        className="mb-3"
      >
        Add New Task
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{columns[2].render(task.priority)}</td>
              <td>{columns[3].render(task.status)}</td>
              <td>{columns[4].render(null, task)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        show={isModalVisible}
        onHide={() => setIsModalVisible(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingTask ? "Edit Task" : "Add New Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskForm
            task={editingTask}
            onSuccess={() => {
              setIsModalVisible(false);
              fetchTasks();
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TaskList;
