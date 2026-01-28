const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/async/books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
public_users.get('/async/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book by ISBN" });
    }
});
  
// Get book details based on author
public_users.get('/async/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});
// Get all books based on title
public_users.get('/async/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});
// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;