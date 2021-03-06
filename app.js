require('./config/config');

// Packages
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Custom modules
const { mongoose } = require('./database/mongoose');
const categoryRoutes = require('./routes/category');
const authenticationRoutes = require('./routes/authentication');
const carRoutes = require('./routes/car');
const customerRoutes = require('./routes/customer');
const rentalRoutes = require('./routes/rental');

// Packages middlewares
app.use(bodyParser.json());

// Custom middlewares

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api', authenticationRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Started on port ${process.env.PORT}`);
});

module.exports = {
    app
};