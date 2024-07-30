import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const ManageBooks = ({ token }) => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/books', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(response.data);
      } catch (error) {
        setMessage('Failed to fetch books.');
      }
    };
    fetchBooks();
  }, [token]);

  const handleAddBook = async () => {
    try {
      await axios.post('/api/books', newBook, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Book added successfully.');
      setNewBook({ title: '', author: '' });
      // Refresh books list
      const response = await axios.get('/api/books', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(response.data);
    } catch (error) {
      setMessage('Failed to add book.');
    }
  };

  const handleRemoveBook = async (bookId) => {
    try {
      await axios.delete(`/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Book removed successfully.');
      // Refresh books list
      setBooks(books.filter(book => book.id !== bookId));
    } catch (error) {
      setMessage('Failed to remove book.');
    }
  };

  return (
    <div>
      <Typography variant="h4">Manage Books</Typography>
      <TextField
        label="Title"
        value={newBook.title}
        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
      />
      <TextField
        label="Author"
        value={newBook.author}
        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
      />
      <Button onClick={handleAddBook}>Add Book</Button>
      <List>
        {books.map(book => (
          <ListItem key={book.id}>
            <ListItemText primary={`${book.title} by ${book.author}`} />
            <Button onClick={() => handleRemoveBook(book.id)}>Remove</Button>
          </ListItem>
        ))}
      </List>
      {message && <Typography>{message}</Typography>}
    </div>
  );
};

export default ManageBooks;
