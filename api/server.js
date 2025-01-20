const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const mongoose = require('mongoose');
const path = require('path');
const { mongoURI } = require('./config');
const Task = require('./models/Task');

// Initialize Firebase Admin with error handling
let serviceAccount;
try {
  serviceAccount = require('./serviceAccountKey.json');
} catch (error) {
  console.error('Error loading serviceAccountKey.json:', error);
  console.log('Please ensure you have placed the Firebase service account key file in the api directory');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Connect to MongoDB with updated options
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000,
  family: 4
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const app = express();
const PORT = 3000;

CORS configuration
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // Changed to false
}));

app.use(express.json());

// Simplified authentication middleware
async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
}

// Updated Tasks endpoints using MongoDB
app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.uid });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    console.log('Creating task for user:', req.user.uid);
    console.log('Task data:', req.body);

    const newTask = new Task({
      ...req.body,
      userId: req.user.uid
    });

    const savedTask = await newTask.save();
    console.log('Task saved:', savedTask);
    return res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ 
      message: 'Error creating task', 
      error: error.message 
    });
  }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    console.log('Updating task:', req.params.id, req.body);
    
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!task) {
      console.log('Task not found');
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Task updated:', task);
    return res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ 
      message: 'Error updating task', 
      error: error.message 
    });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
