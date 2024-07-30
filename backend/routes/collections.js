const express = require('express');
const router = express.Router();
const { Collection, Books_Collections, Book } = require('../models');

// Add a book to a collection
router.post('/:collectionId/books/:bookId', async (req, res) => {
  try {
    const { collectionId, bookId } = req.params;
    await Books_Collections.create({ collectionId, bookId });
    res.status(201).json({ message: 'Book added to collection' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove a book from a collection
router.delete('/:collectionId/books/:bookId', async (req, res) => {
  try {
    const { collectionId, bookId } = req.params;
    const entry = await Books_Collections.findOne({ where: { collectionId, bookId } });
    if (entry) {
      await entry.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Entry not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
