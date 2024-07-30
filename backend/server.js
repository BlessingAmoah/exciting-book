const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const booksRoutes = require('./routes/books');
const collectionsRoutes = require('./routes/collections');
const profileRoutes = require('./routes/profile');
const authRoutes = require('./routes/auth'); 
const cors = require('cors');


app.use(bodyParser.json());
// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

app.use('/api/books', booksRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
