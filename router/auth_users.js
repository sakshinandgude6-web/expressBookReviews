const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 
  let userswithsamename = users.filter((user) => user.username === username);
  return userswithsamename.length > 0;
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => user.username === username && user.password === password);
  return validusers.length > 0;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    
    // Store access token in session
    req.session.authorization = { accessToken, username };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let filtered_book = books[isbn];
  
  if (filtered_book) {
      let review = req.query.review;
      let reviewer = req.session.authorization['username'];
      if(review) {
          filtered_book['reviews'][reviewer] = review;
          books[isbn] = filtered_book;
      }
      res.send(`The review for the book with ISBN ${isbn} has been added/updated.`);
  } else {
      res.send("Unable to find book!");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;