import React, { useEffect } from 'react';
import { Row, Col, Card, Dropdown, Button } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { setTasks, deleteTask } from '../../store/slices/taskSlice';
import axios from '../../utils/axios';
import TaskModal from './TaskModal';

const TaskBoard = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState(null);
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

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    // If dropped in the same list but different position don't need to update status
    if (source.droppableId === destination.droppableId) {
      return;
    }

    // Get the task that was dragged
    const task = tasks.find(t => t._id === draggableId);
    
    try {
      // Update the task status based on the destination droppableId
      const updatedTask = {
        ...task,
        status: destination.droppableId
      };

      // Make API call to update task
      await axios.put(`/tasks/${task._id}`, updatedTask);
      
      // Refresh tasks after update
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

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

  const TaskCard = ({ task }) => (
    <Card className={`mb-2 border-${getStatusColor(task.status)} `} 
          style={{ borderLeftWidth: '5px' }}>
      <Card.Body className={`p-2 bg-${getStatusColor(task.status)} bg-opacity-10`}>
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex align-items-center">
            <div>
              <div className="fw-bold">{task.title}</div>
              <small className="text-muted">{task.description}</small>
              <div className="mt-1">
                <span className={`badge bg-${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className={`badge bg-${getPriorityColor(task.priority)} ms-2`}>
                  {task.priority.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <Dropdown align="end">
              <Dropdown.Toggle as={CustomToggle} className="btn-dots">
                <BsThreeDotsVertical />
              </Dropdown.Toggle>
              <Dropdown.Menu popperConfig={{
                modifiers: [
                  {
                    name: 'preventOverflow',
                    options: {
                      padding: 10,
                    },
                  },
                ],
              }}>
                <Dropdown.Item onClick={() => {
                  setEditingTask(task);
                  setShowModal(true);
                }}>Edit</Dropdown.Item>
                <Dropdown.Item onClick={() => handleDelete(task._id)}>Delete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
      className="btn btn-link text-dark p-0"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </button>
  ));

  const filterTasks = (status) => tasks.filter(task => task.status === status);

  const TaskList = ({ status, tasks }) => (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div 
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`task-column ${snapshot.isDraggingOver ? 'dragging-over' : ''} d-flex flex-column`}
          style={{ height: 'calc(100vh - 150px)' }} 
        >
          <div className="column-title d-flex justify-content-between align-items-center sticky-top bg-light py-2 px-2 rounded-3">
            <span>{status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}</span>
            <span className={`badge bg-${getStatusColor(status)}`}>{tasks.length}</span>
          </div>
          
          <div className="overflow-auto flex-grow-1">
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? 0.8 : 1
                    }}
                  >
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {tasks.length === 0 && (
              <div className="text-center text-muted p-3">
                No {status.replace('_', ' ')} tasks
              </div>
            )}
          </div>
        </div>
      )}
    </Droppable>
  );

  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Task Manager</h3>
        <Button
          variant="primary"
          onClick={() => {
            setEditingTask(null);
            setShowModal(true);
          }}
        >
          Add New Task
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Row className="flex-grow-1 g-3">
          <Col md={4}>
            <TaskList status="pending" tasks={filterTasks('pending')} />
          </Col>
          <Col md={4}>
            <TaskList status="in_progress" tasks={filterTasks('in_progress')} />
          </Col>
          <Col md={4}>
            <TaskList status="completed" tasks={filterTasks('completed')} />
          </Col>
        </Row>
      </DragDropContext>

      <TaskModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSuccess={() => {
          setShowModal(false);
          setEditingTask(null);
          fetchTasks();
        }}
      />
    </div>
  );
};

export default TaskBoard;
