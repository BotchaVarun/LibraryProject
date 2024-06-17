const express = require("express");
const bodyparser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(upload.single('image'));
// Set up CORS options
const corsOptions = {
  origin: 'http://127.0.0.1:5500',
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/add", (req, res) => {
  return res.send("<h1>Hello</h1>");
});

const server = '127.0.0.1:27017'; 
const database = 'main'; 
mongoose.connect(`mongodb://${server}/${database}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connection successful');
    })
    .catch((err) => {
        console.error('Database connection failed', err);
});

const userSchema = new mongoose.Schema({
  name:String,
  phoneno:String,
  email: String,
  password: String
});
const bookSchema = new mongoose.Schema({
    author:String,
    name: String,
    desc:String,
    image: { data: Buffer, contentType: String },
    domain:String,
    price: String,
    status: { type: String, default: 'available' },
    takenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    date:Date
});
const magazineSchema = new mongoose.Schema({
    author: String,
    name: String,
    desc: String,
    image: {
        data: Buffer,
        contentType: String
    },
    domain: String,
    price: String,
    takenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, default: 'available' },
    date:Date
});
const comicSchema = new mongoose.Schema({
    author: String,
    name: String,
    desc: String,
    image: {
        data: Buffer,
        contentType: String
    },
    domain: String,
    price: String,
    status: { type: String, default: 'available' },
    takenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    date:Date
});
const logSchema = new mongoose.Schema({
  takenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, default: 'available' }
});

const User = mongoose.model("User", userSchema);
const Book = mongoose.model("Book", bookSchema);
const Log = mongoose.model("Log", logSchema);
const Mag = mongoose.model("Mag",magazineSchema);
const Com = mongoose.model("Com",comicSchema);
var jsonparser = bodyparser.json();


app.post("/signup", jsonparser, (req, res) => {
  const { name, phoneno, email, password } = req.body;

  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        console.log("User with this email already exists");
        res.status(409).send("User with this email already exists"); // 409 Conflict
      } else {
        const newUser = new User({
          name,
          phoneno,
          email,
          password
        });

        newUser.save()
          .then(() => {
            console.log("Saved user to MongoDB");
            res.status(201).send("User created successfully"); // 201 Created
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error saving user");
          });

        console.log("New user created: ", newUser);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error checking existing user");
    });
});


app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  User.findOne({ email, password })
    .then(user => {
      if (user) {
        console.log("login successfully");
        res.status(200).send("Sign-in successful");
        const log = new Log({
          takenBy: user._id,
          status: "true"
        });
        log.save();
      } else {
        res.status(401).send("Invalid credentials");
        console.log("Invalid credentials");
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Error during sign-in");
    });
});

// Route to handle file and form data
// app.post('/addbook', bodyparser.json(), (req, res) => {
//     const newBook = new Book({
//       author: req.body.author,
//       name: req.body.name,
//       desc: req.body.desc,
//       image: {
//         data: req.file.buffer.toString('base64'), // Convert buffer to base64 string
//         contentType: req.file.mimetype
//       },
//       domain: req.body.domain,
//       price: req.body.price
//     });
  
//     newBook.save()
//       .then(() => {
//         console.log("Saved book to MongoDB");
//         res.send("The data has been received");
//       })
//       .catch((error) => {
//         console.error(error);
//         res.status(500).send(error);
//       });
  
//     console.log("New book created: ", newBook);
//   });
app.post('/addbook', bodyparser.json(), (req, res) => {
    const newBook = new Book({
        author: req.body.author,
        name: req.body.name,
        desc: req.body.desc,
        image: {
            data: req.file.buffer,
            contentType: req.file.mimetype
        },
        domain: req.body.domain,
        price: req.body.price
    });

    newBook.save()
        .then(() => {
            console.log("Saved magazine to MongoDB");
            res.status(200).json({ message: "Magazine added successfully" });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Error saving magazine to MongoDB" });
        });
});

app.post('/remove', bodyparser.json(), (req, res) => {
  Book.findOne({ name: req.body.name })
    .then((book) => {
      if (!book) {
        return res.status(404).send("Book not found");
      }
      return Book.deleteOne({ name: req.body.name });
    })
    .then(() => {
      res.status(200).send("Book deleted successfully");
    })
    .catch((error) => {
      console.error(error);
      if (!res.headersSent) {
        res.status(500).send("Error deleting book");
      }
    });
});

app.post('/taken', bodyparser.json(), (req, res) => {
  Book.findOne({ name: req.body.name })
    .then((book) => {
      if (!book) {
        return res.status(404).send("Book not found");
      }
      if (book.status === "available") {
        return Book.updateOne({ name: req.body.name }, { $set: { status: "taken" } })
          .then(() => {
            res.status(200).send("Book is taken");
          });
      } else {
        res.status(409).send("Book is already taken"); // 409 Conflict is a more appropriate status code
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error while taking book");
    });
});
// Update your DELETE route to use findByIdAndDelete
// DELETE route for books
app.delete('/deletebook/:id', (req, res) => {
    const bookId = req.params.id;

    Book.findByIdAndDelete(bookId)
        .then(deletedBook => {
            if (!deletedBook) {
                return res.status(404).json({ error: 'Book not found' });
            }
            res.status(200).json({ message: 'Book deleted successfully', deletedBook });
        })
        .catch(error => {
            console.error('Error deleting book:', error);
            res.status(500).json({ error: 'Error deleting book' });
        });
});

// DELETE route for magazines
app.delete('/deletemag/:id', (req, res) => {
    const magazineId = req.params.id;

    Mag.findByIdAndDelete(magazineId)
        .then(deletedMagazine => {
            if (!deletedMagazine) {
                return res.status(404).json({ error: 'Magazine not found' });
            }
            res.status(200).json({ message: 'Magazine deleted successfully', deletedMagazine });
        })
        .catch(error => {
            console.error('Error deleting magazine:', error);
            res.status(500).json({ error: 'Error deleting magazine' });
        });
});
// DELETE route for comic
app.delete('/deletecom/:id', (req, res) => {
    const comicId = req.params.id;

    Com.findByIdAndDelete(comicId)
        .then(deletedComic => {
            if (!deletedComic) {
                return res.status(404).json({ error: 'Magazine not found' });
            }
            res.status(200).json({ message: 'Magazine deleted successfully', deletedComic });
        })
        .catch(error => {
            console.error('Error deleting magazine:', error);
            res.status(500).json({ error: 'Error deleting magazine' });
        });
});
// PUT route to update book status and takenBy
app.put('/books/:id', bodyparser.json(), (req, res) => {
  const bookId = req.params.id;
  const newStatus = req.body.status;
  const currentDate = new Date();
  // Find a recent log entry for the current user
  Log.findOne({ status: "true" }).then(log => {
    // Update book status and takenBy in MongoDB
    Book.findByIdAndUpdate(bookId, { status: newStatus, takenBy: log.takenBy, date: currentDate }, { new: true })
      .then(updatedBook => {
        if (!updatedBook) {
          return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json({ message: 'Book status updated successfully', updatedBook });
      })
      .catch(error => {
        console.error('Error updating book status:', error);
        res.status(500).json({ error: 'Error updating book status' });
      });
  }).catch(error => {
    console.error('Error finding log entry:', error);
    res.status(500).json({ error: 'Error finding log entry' });
  });
});

// Endpoint to fetch books
app.get('/book', async (req, res) => {
  try {
      const domain = req.query.domain; // Get domain from query parameters
      let query = { status: "available" }; // Default query to fetch only available books

      if (domain) {
          query.domain = domain; // Add domain filter if provided
      }

      const books = await Book.find(query);

      // Map books to include base64 encoded image
      const booksWithBase64Image = books.map(book => ({
          ...book._doc,
          image: book.image ? {
              data: book.image.data.toString('base64'), // Convert buffer to base64 string
              contentType: book.image.contentType
          } : null // Handle case when image is not available
      }));

      res.json(booksWithBase64Image);
  } catch (err) {
      res.status(500).send(err);
  }
});
app.put('/magazine/:id', bodyparser.json(), (req, res) => {
  const bookId = req.params.id;
  const newStatus = req.body.status;
  const currentDate = new Date();
  // Find a recent log entry for the current user
  Log.findOne({ status: "true" })
    .then(log => {
      if (!log) {
        return res.status(404).json({ error: 'No active log entry found' });
      }

      // Update magazine status and takenBy in MongoDB
      Mag.findByIdAndUpdate(bookId, { status: newStatus, takenBy: log.takenBy,date: currentDate }, { new: true })
        .then(updatedBook => {
          if (!updatedBook) {
            return res.status(404).json({ error: 'Magazine not found' });
          }
          res.status(200).json({ message: 'Magazine status updated successfully', updatedBook });
        })
        .catch(error => {
          console.error('Error updating magazine status:', error);
          res.status(500).json({ error: 'Error updating magazine status' });
        });
    })
    .catch(error => {
      console.error('Error finding log entry:', error);
      res.status(500).json({ error: 'Error finding log entry' });
    });
});
app.put('/comic/:id', bodyparser.json(), (req, res) => {
  const bookId = req.params.id;
  const newStatus = req.body.status;
  const currentDate = new Date();
  // Find a recent log entry for the current user
  Log.findOne({ status: "true" })
    .then(log => {
      if (!log) {
        return res.status(404).json({ error: 'No active log entry found' });
      }

      // Update magazine status and takenBy in MongoDB
      Com.findByIdAndUpdate(bookId, { status: newStatus, takenBy: log.takenBy,date:currentDate}, { new: true })
        .then(updatedBook => {
          if (!updatedBook) {
            return res.status(404).json({ error: 'Magazine not found' });
          }
          res.status(200).json({ message: 'Magazine status updated successfully', updatedBook });
        })
        .catch(error => {
          console.error('Error updating magazine status:', error);
          res.status(500).json({ error: 'Error updating magazine status' });
        });
    })
    .catch(error => {
      console.error('Error finding log entry:', error);
      res.status(500).json({ error: 'Error finding log entry' });
    });
});

app.get('/takenbooks', async (req, res) => {
  try {
    const log = await Log.findOne({ status: "true" });
    if (!log) {
      return res.status(404).send("No active session found");
    }

    const books = await Book.find({ takenBy: log.takenBy, status: "taken" });

    // Map books to include base64 encoded image
    const booksWithBase64Image = books.map(book => ({
      ...book._doc,
      image: book.image ? {
        data: book.image.data.toString('base64'), // Convert buffer to base64 string
        contentType: book.image.contentType
      } : null // Handle case when image is not available
    }));

    res.status(200).json(booksWithBase64Image);
  } catch (error) {
    console.error('Error fetching taken books:', error);
    res.status(500).send("Error fetching taken books");
  }
});
app.get('/takenmagazine', async (req, res) => {
  try {
    const log = await Log.findOne({ status: "true" });
    if (!log) {
      return res.status(404).send("No active session found");
    }

    const books = await Mag.find({ takenBy: log.takenBy, status: "taken" });

    // Map books to include base64 encoded image
    const booksWithBase64Image = books.map(book => ({
      ...book._doc,
      image: book.image ? {
        data: book.image.data.toString('base64'), // Convert buffer to base64 string
        contentType: book.image.contentType
      } : null // Handle case when image is not available
    }));

    res.status(200).json(booksWithBase64Image);
  } catch (error) {
    console.error('Error fetching taken books:', error);
    res.status(500).send("Error fetching taken books");
  }
});
app.get('/takencomic', async (req, res) => {
  try {
    const log = await Log.findOne({ status: "true" });
    if (!log) {
      return res.status(404).send("No active session found");
    }

    const books = await Com.find({ takenBy: log.takenBy, status: "taken" });

    // Map books to include base64 encoded image
    const booksWithBase64Image = books.map(book => ({
      ...book._doc,
      image: book.image ? {
        data: book.image.data.toString('base64'), // Convert buffer to base64 string
        contentType: book.image.contentType
      } : null // Handle case when image is not available
    }));

    res.status(200).json(booksWithBase64Image);
  } catch (error) {
    console.error('Error fetching taken books:', error);
    res.status(500).send("Error fetching taken books");
  }
});

// Endpoint to add a new book
app.post('/book', bodyparser.json(), (req, res) => {
  const newBook = new Book({ name: req.body.name, status: req.body.status || 'available' });
  newBook.save()
    .then(() => res.status(201).send("Book added successfully"))
    .catch(error => res.status(500).send("Error adding book"));
});
app.put('/logout', bodyparser.json(), (req, res) => {
  Log.findOne({ status: "true" }).then(log => {
    if (!log) {
      return res.status(404).send("No active session found");
    }
    
    // Update the log document
    log.status = "false";
    log.save()
      .then(() => {
        res.status(200).send("Account is logged out");
      })
      .catch(error => {
        console.error('Error updating log status:', error);
        res.status(500).send("Error during logout");
      });
  }).catch(error => {
    console.error('Error finding log entry:', error);
    res.status(500).send("Error during logout");
  });
});
/* login user information */
// Add this endpoint to fetch user details
app.get('/user', async (req, res) => {
  try {
    // Check if there is an active session/logged-in user
    const log = await Log.findOne({ status: "true" });
    if (!log) {
      return res.status(404).send("No active session found");
    }

    // Fetch user details based on the logged-in user's ID
    const user = await User.findById(log.takenBy);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Return user details
    res.status(200).json({
      email: user.email,
      name:user.name,
      phone:user.phoneno
      // Add any other user information you want to return
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send("Error fetching user details");
  }
});
//all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).send("Users not found");
    }
    const userDetails = users.map(user => ({
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phoneno
    }));
    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send("Error fetching user details");
  }
});

// Route to get books taken by a specific user
// Fetch books borrowed by a specific user

// Route to fetch books, magazines, and comics borrowed by a specific user
// Route to fetch books, magazines, and comics borrowed by a specific user
app.get('/users/:userId/items', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Default query to fetch items taken by the user
    let query = { takenBy: userId };

    // Check if domain filter is provided in query parameters
    const domain = req.query.domain;
    if (domain) {
      query.domain = domain;
    }

    // Fetch books, magazines, and comics for the user with status "taken"
    const [books, magazines, comics] = await Promise.all([
      Book.find({ ...query, status: "taken" }).lean(),
      Mag.find({ ...query, status: "taken" }).lean(),
      Com.find({ ...query, status: "taken" }).lean()
    ]);

    // Map books to include base64 encoded image and title
    const booksWithBase64Image = books.map(book => ({
      ...book,
      image: book.image ? {
        data: book.image.data.toString('base64'), // Convert buffer to base64 string
        contentType: book.image.contentType
      } : null,
      type: 'book' // Include item type
    }));

    // Map magazines to include base64 encoded image and title
    const magazinesWithBase64Image = magazines.map(magazine => ({
      ...magazine,
      image: magazine.image ? {
        data: magazine.image.data.toString('base64'),
        contentType: magazine.image.contentType
      } : null,
      type: 'magazine'
    }));

    // Map comics to include base64 encoded image and title
    const comicsWithBase64Image = comics.map(comic => ({
      ...comic,
      image: comic.image ? {
        data: comic.image.data.toString('base64'),
        contentType: comic.image.contentType
      } : null,
      type: 'comic'
    }));

    // Construct response object including user email, name, and items data
    const response = {
      userEmail: user.email,
      userName: user.name,
      items: [...booksWithBase64Image, ...magazinesWithBase64Image, ...comicsWithBase64Image]
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching items data:', error);
    res.status(500).send("Error fetching items data");
  }
});


/* magazine */
app.get('/magazine', async (req, res) => {
    try {
      const domain = req.query.domain; // Get domain from query parameters
      let query = { status: "available" }; // Default query to fetch only available books

      if (domain) {
          query.domain = domain; // Add domain filter if provided
      }

      const books = await Mag.find(query);

      // Map books to include base64 encoded image
      const magazinesWithBase64Image = books.map(book => ({
          ...book._doc,
          image: book.image ? {
              data: book.image.data.toString('base64'), // Convert buffer to base64 string
              contentType: book.image.contentType
          } : null 
        }));

        res.json(magazinesWithBase64Image);
    } catch (err) {
        console.error('Error fetching magazines:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/comic', async (req, res) => {
    try {
      const domain = req.query.domain; // Get domain from query parameters
      let query = { status: "available" }; // Default query to fetch only available books

      if (domain) {
          query.domain = domain; // Add domain filter if provided
      }

      const books = await Com.find(query);

      // Map books to include base64 encoded image
      const comicsWithBase64Image = books.map(book => ({
          ...book._doc,
          image: book.image ? {
              data: book.image.data.toString('base64'), // Convert buffer to base64 string
              contentType: book.image.contentType
          } : null 
        }));

        res.json(comicsWithBase64Image);
    } catch (err) {
        console.error('Error fetching magazines:', err);
        res.status(500).send('Internal Server Error');
    }
});
  app.post('/addmagazine', bodyparser.json(), (req, res) => {
    const newMag = new Mag({
        author: req.body.author,
        name: req.body.name,
        desc: req.body.desc,
        image: {
            data: req.file.buffer,
            contentType: req.file.mimetype
        },
        domain: req.body.domain,
        price: req.body.price
    });

    newMag.save()
        .then(() => {
            console.log("Saved magazine to MongoDB");
            res.status(200).json({ message: "Magazine added successfully" });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Error saving magazine to MongoDB" });
        });
});
/* comic */
app.get('/comic', async (req, res) => {
    try {
        let query = {};
        const domain = req.query.domain;

        if (domain) {
            query = { domain: domain };
        }

        const books = await Com.find(query);

        // Convert image data to base64
        const booksWithBase64Image = books.map(book => {
            return {
                ...book._doc,
                image: {
                    data: book.image.data.toString('base64'), // Convert buffer to base64 string
                    contentType: book.image.contentType
                }
            };
        });

        res.json(booksWithBase64Image);
    } catch (err) {
        console.error('Error fetching comics:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  app.post('/addcomic', bodyparser.json(), (req, res) => {
    const newCom = new Com({
        author: req.body.author,
        name: req.body.name,
        desc: req.body.desc,
        image: {
            data: req.file.buffer,
            contentType: req.file.mimetype
        },
        domain: req.body.domain,
        price: req.body.price
    });

    newCom.save()
        .then(() => {
            console.log("Saved magazine to MongoDB");
            res.status(200).json({ message: "comic added successfully" });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Error saving comic to MongoDB" });
        });
});
app.listen(3002, () => {
  console.log("The server is active on port 3002");
});


