const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bcrypt = require('bcryptjs'); // For password hashing
const crypto = require('crypto'); // Ensure this is correctly imported
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();
const session = require('express-session');

const app = express();
const port = 3000;

// Set up session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/MiniProject', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// User schema for the MongoDB collection
const UserSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  Password: String,
  Contact: String
});

// Define User model based on the schema
const User = mongoose.model('User', UserSchema); // Define the model here

// Define routes
app.get('/', (req, res) => {
  res.render('nextrip_login'); // Render the index.ejs template
});

app.get('/register', (req, res) => {
  res.render('nexttrip_register'); // Render the login.ejs template
});

app.get('/forgot', (req, res)=>{
  res.render('Forgot_password');
});

app.get('/home', (req,res)=>{
  res.render('NextTrip');
})


app.post('/register', async (req, res) => {
  const { name, email, password, contact } = req.body;

  // Validate user input (optional but recommended)
  // You can use a validation library like Express Validator

  try {
    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust salt rounds as needed

    const newUser = new User({
      Name: name,
      Email: email,
      Password: hashedPassword,
      Contact: contact
    });

    await newUser.save();
    res.redirect('/'); // Redirect to login page after successful registration
  } catch (err) {
    console.error('Error during registration:', err);
    // Handle specific errors (e.g., email already exists)
    if (err.code === 11000) { // Duplicate key error (e.g., email already exists)
      res.status(400).send('Email already in use. Please choose a different one.');
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
});

//route for thr login page
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ Email: email });

    if (!user) {
      return res.status(400).send('Invalid email or password');
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.Password);   


    if (!isMatch) {
      return res.status(400).send('Invalid email or password');
    }

    // Successful login, redirect to the home page or desired route
    res.redirect('/home'); // Replace '/home' with your desired route
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Internal Server Error');
  }
});


//password resetting
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ Email: email });

    if (!user) {
      return res.status(400).send('Email not found');
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Set the reset token and expiration time in the user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();

    // Log environment variables for debugging
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

    // Send a password reset email to the user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Link',
      html: `<p>You requested a password reset. Please click the following link to reset your password:</p>
             <a href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending password reset email:', error);
        return res.status(500).send('Error sending password reset email');
      } else {
        console.log('Password reset email sent successfully');
        return res.send('Password reset email sent. Please check your inbox.');
      }
    });
  } catch (err) {
    console.error('Error during password reset:', err);
    return res.status(500).send('Internal Server Error');
  }
});

console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

// Define a schema and model for the query
const querySchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  phone: String
});

// const Query = mongoose.model('Query', querySchema);


const Query = mongoose.model('Query', querySchema);

// POST route for query submission
app.post('/query', async (req, res) => {
  const { name, email, message, phone } = req.body;
  try {
    const newQuery = new Query({ name, email, message, phone });
    await newQuery.save();
    res.redirect('/home');
    // res.status(201).json({ message: 'Query submitted successfully' });
  } catch (error) {
    console.error('Error submitting query:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/AdminLogin',(req, res)=>{
  res.render('adminlogin');
})
const Bus = require('./models/Bus');
const Stop = require('./models/Stops');
const Admin  = require('./models/admin');

// POST route for adding a new bus
app.post('/bus', async (req, res) => {
  const { bus_no, bus_name, rg_no, driver_name, cond_name, capacity } = req.body;
  try {
    const newBus = new Bus({ bus_no, bus_name, rg_no, driver_name, cond_name, capacity });
    await newBus.save();
    res.status(201).json({ message: 'Bus added successfully' });
  } catch (error) {
    console.error('Error adding bus:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST route for adding a new stop
app.post('/stop', async (req, res) => {
  const { origin, destination, total_cost, bus_no } = req.body;
  const stops = req.body.stops;

  try {
    // Convert stop_time from 'HH:MM' to a Date object
    stops.forEach(stop => {
      if (stop.stop_time) {
        // Assuming today's date for simplicity; you can use another date if needed
        const [hours, minutes] = stop.stop_time.split(':');
        const date = new Date(); // or use a specific date
        date.setHours(hours, minutes, 0, 0); // Set hours and minutes
        stop.stop_time = date; // Convert to Date object
      }
    });

    const newStop = new Stop({ origin, destination, stops, total_cost, bus_no });
    await newStop.save();
    res.status(201).json({ message: 'Stop added successfully' });
  } catch (error) {
    console.error('Error adding stop:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



//get froute for admmin home
app.get('/adminHome', (req,res)=>{
  res.render('admin');
})

// POST route for admin login
app.post('/adminlogin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ Email: email });

    if (!user) {
      return res.status(400).send('Invalid email or password');
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.Password);   


    if (!isMatch) {
      return res.status(400).send('Invalid email or password');
    }

    // Successful login, redirect to the home page or desired route
    res.redirect('/adminHome'); // Replace '/home' with your desired route
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to fetch all buses
app.get('/buses', async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to fetch all stops
app.get('/stops', async (req, res) => {
  try {
    const stops = await Stop.find(); // Ensure the model is correctly named
    res.json(stops);
  } catch (error) {
    console.error('Error fetching stops:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Route to fetch all queries
app.get('/queries', async (req, res) => {
  try {
    const queries = await Query.find();
    res.json(queries);
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Route to handle form submission
app.post('/search', (req, res) => {
  const { from, to, stop, date, time } = req.body;
  // Pass the form data to search1.ejs
  res.render('search1', { from, to, stop, date, time });
});



//route to handle the form submisssion of search queries
// Updated search route
app.get('/search', async (req, res) => {
  const { from, to, stop, date, time } = req.query; // Get search parameters from query string

  try {
    // Step 1: Find the relevant stops based on the search criteria
    const matchingStops = await Stop.find({
      origin: from,
      destination: to,
      'stops.stop_name': stop // Check if the stop exists in the stops array
    });

    // Step 2: Find all buses available on the found routes using bus_no
    const busNumbers = matchingStops.map(stop => stop.bus_no); // Extract bus numbers
    const availableBuses = await Bus.find({ bus_no: { $in: busNumbers } }); // Find buses by their numbers

    // Step 3: Render the search results in the search1.ejs page
    res.render('search1', { 
      bus: availableBuses, // Pass 'buses' to the template
      stops: matchingStops,
      from,
      to,
      stop,
      date,
      time 
    });
    console.log('Available Buses:', availableBuses);
    console.log('Matching Stops:', matchingStops);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/');
  });
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});