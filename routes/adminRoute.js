const express = require('express');
const session = require('express-session');
const config = require('../config/config');
const auth = require('../middleware/adminAuth');
const { use } = require('./userRoute');
const adminRoute = express();
const nocache = require('nocache');
const adminController = require('../controllers/adminController');
const multer = require('multer');



adminRoute.use(express.json());
adminRoute.use(express.urlencoded({ extended: true }));
adminRoute.set('view engine', 'ejs');
adminRoute.set('views', './views/admin');
adminRoute.use(nocache());
adminRoute.use(session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    resave: true
}))




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/public/userimages'))
    },
    filename: function () {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
})

const upload = multer({ storage: storage });







adminRoute.get('/', auth.isLogout, adminController.loadLogin)

adminRoute.post('/', adminController.verifyLogin);

adminRoute.get('/home', auth.isLogin, adminController.loaddashboard);

adminRoute.get('/logout', auth.isLogin, adminController.logout);

adminRoute.get('/dashboard', auth.isLogin, adminController.admindashboard);

adminRoute.get('/newuser', auth.isLogin, adminController.newuserload)
adminRoute.post('/newuser', adminController.adduser)

adminRoute.get('/edituser', auth.isLogin, adminController.edituser)

adminRoute.post('/edituser', adminController.updateusers)

adminRoute.get('/deleteuser', adminController.deleteuser);


adminRoute.get('*', (req, res) => {
    res.redirect('/admin')
})



///exporting///
module.exports = adminRoute;