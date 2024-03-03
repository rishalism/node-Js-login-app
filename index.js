const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/usm");
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

///user route///
const userRoute = require('./routes/userRoute');
app.use('/', userRoute);



//admin route ///

const adminRoute = require('./routes/adminRoute')
app.use('/admin', adminRoute);



//server is lisening///
app.listen(3000, () => {
    console.log(`server is running at http://localhost:3000/`);
});