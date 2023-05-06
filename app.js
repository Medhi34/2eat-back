const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const userRoutes = require('./routes/user');
const restaurantRoutes = require('./routes/restaurant');
const mealRoutes = require('./routes/meal');
const orderRoutes = require('./routes/order');
const appreciationRoutes = require('./routes/appreciation');

const uri = "mongodb://127.0.0.1:27017/2eat";
mongoose.connect(uri,
    {   useNewUrlParser: true,
        useUnifiedTopology: true})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(error => console.log('Connexion à MongoDB échouée ! : ' + error)
);

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/appreciations', appreciationRoutes);

module.exports = app;