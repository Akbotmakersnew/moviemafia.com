const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb://localhost:27017/login-system', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the user schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

// Create a model for the user schema
const User = mongoose.model('User', userSchema);

app.use(express.json());

// Handle login requests
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ username });

    if (!user) {
        return res.json({ success: false, message: 'Invalid username or password' });
    }

    // Check if the password is correct
    if (password !== user.password) {
        return res.json({ success: false, message: 'Invalid username or password' });
    }

    // Return a success response
    res.json({ success: true });
});

// Handle sign-up requests
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Check if the username or email is already taken
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
        return res.json({ success: false, message: 'Username or email is already taken' });
    }

    // Create a new user
    const user = new User({ username, email, password });

    // Save the user to the database
    await user.save();

    // Return a success response
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
