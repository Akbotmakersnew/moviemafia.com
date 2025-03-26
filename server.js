const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');

// Connect to the database
mongoose.connect('mongodb://localhost:27017/login-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create a model for the user schema
const User = mongoose.model('User', userSchema);

// Define a schema for validating user input
const userInputSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

app.use(express.json());

// Handle login requests
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate user input
    const { error } = userInputSchema.validate(req.body);
    if (error) {
      return res.json({ success: false, message: error.details[0].message });
    }

    // Find the user in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ success: false, message: 'Invalid username or password' });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.json({ success: false, message: 'Invalid username or password' });
    }

    // Return a success response
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Internal server error' });
  }
});

// Handle sign-up requests
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate user input
    const { error } = userInputSchema.validate(req.body);
    if (error) {
      return res.json({ success: false, message: error.details[0].message });
    }

    // Check if the username or email is already taken
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.json({ success: false, message: 'Username or email is already taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ username, email, password: hashedPassword });

    // Save the user to the database
    await user.save();

    // Return a success response
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
