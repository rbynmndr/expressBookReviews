const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: "Username and password are required."});

  }
  if(users[req.body.username]){
    return res.status(400).json({message: "User already exists."});
  }
  users[req.body.username] = {
    password: req.body.password
  };
  return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  let bookPromise = await new Promise((resolve, reject) => {
    resolve(books);
  });
  return res.send(JSON.stringify(bookPromise, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  let bookPromise = await new Promise((resolve, reject) => {
    resolve(books[isbn])
  });
  return res.send(JSON.stringify(bookPromise, null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author;
  let bookPromise = await new Promise((resolve, reject) => {
    let booksByAuthor = [];
    let bookKeys = Object.keys(books);
    for (let i = 0; i < bookKeys.length; i++) {
        let book = books[bookKeys[i]];
        if (book.author === author) {
            booksByAuthor.push(book);
        }
    }
    resolve(booksByAuthor)
  });
  

  return res.send(JSON.stringify(bookPromise, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    let bookPromise = await new Promise((resolve, reject) => {
        let booksByTitle = [];
        let bookKeys = Object.keys(books);
        for (let i = 0; i < bookKeys.length; i++) {
          let book = books[bookKeys[i]];
          if (book.title === title) {
              booksByTitle.push(book);
            }
        }
        resolve(booksByTitle)
    });
    
  
    return res.send(JSON.stringify(bookPromise, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  return res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
