const express = require('express');
const router = express.Router();
const { Book } = require('../models');

// Add a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, genre, publishedDate } = req.body;
    const book = await Book.create({ title, author, genre, publishedDate });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Edit an existing book
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, publishedDate } = req.body;
    const book = await Book.findByPk(id);
    if (book) {
      await book.update({ title, author, genre, publishedDate });
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove a book
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (book) {
      await book.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
