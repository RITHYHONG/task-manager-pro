import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';

const TaskCard = ({ task, onDelete, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'pending':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <Card 
      className={`mb-2 border-${getStatusColor(task.status)}`} 
      style={{ borderLeftWidth: '5px', cursor: 'pointer', position: 'relative' }}
      onClick={onClick}
    >
      <Card.Body className={`p-2 bg-${getStatusColor(task.status)} bg-opacity-10`}>
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex align-items-center">
            <div>
              <div className="fw-bold">{task.title}</div>
              <small className="text-muted">{task.description}</small>
              <div className="mt-1 d-flex gap-2 flex-wrap">
                <span className={`badge bg-${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className={`badge bg-${getPriorityColor(task.priority)}`}>
                  {task.priority.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Button 
          variant="link" 
          className="text-danger p-0" 
          style={{ position: 'absolute', bottom: '10px', left: '10px' }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
        >
          <BsTrash />
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TaskCard;
