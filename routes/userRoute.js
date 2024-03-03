const express = require('express');
const userroute = express();
const usercontroller = require('../controllers/userController');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const config = require('../config/config');
const auth = require('../middleware/auth');
const nocache = require('nocache');

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

userroute.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: false
}))
userroute.use(express.json());
userroute.use(express.urlencoded({ extended: true }));
userroute.set('view engine', 'ejs');
userroute.set('views', './views/users');
userroute.use(nocache());


userroute.get('/', auth.isLogout, usercontroller.loginLoad)
userroute.get('/login', auth.isLogout, usercontroller.loginLoad);
userroute.post('/login', usercontroller.verifylogin);


userroute.get('/register', auth.isLogout, usercontroller.loadregister);
userroute.post('/register', upload.single('image'), usercontroller.insetUser);

userroute.get('/home', auth.isLogin, usercontroller.loadhome)

userroute.get('/logout', auth.isLogout, usercontroller.userLogout)

userroute.get('/edit', auth.isLogin, usercontroller.editLoad)
userroute.post('/edit', usercontroller.updateProfile)


//exporting//
module.exports = userroute;