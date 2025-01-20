import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TaskBoard from './tasks/TaskBoard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <Container fluid className="p-4 dashboard ">
      <TaskBoard />
    </Container>
  );
};

export default Dashboard;