require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { auth } = require('express-openid-connect');

const app = express();
const port = process.env.PORT || 3000;

// Configure express-session
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
};

app.use(session(sessionConfig));

// Configure Auth0
const authConfig = {
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    secret: process.env.AUTH0_SECRET
};

app.use(auth(authConfig));

// Serve static files
app.use(express.static('public'));

// Secured route
app.get('/account', (req, res) => {
    try {
        if (req.oidc.isAuthenticated()) {
            res.sendFile(__dirname + '/public/account.html');
        } else {
            res.status(401).send('Authentication required.');
        }
    } catch (error) {
        res.status(500).send('Server error.');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/logout', (req, res) => {
    req.oidc.logout({
        returnTo: process.env.BASE_URL
    });
});