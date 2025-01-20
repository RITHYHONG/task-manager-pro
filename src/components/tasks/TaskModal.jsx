import React from 'react';
import { Modal } from 'react-bootstrap';
import TaskForm from './TaskForm';

const TaskModal = ({ show, onHide, task, onSuccess }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{task ? "Edit Task" : "Add New Task"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TaskForm
          task={task}
          onSuccess={onSuccess}
        />
      </Modal.Body>
    </Modal>
  );
};

export default TaskModal;
