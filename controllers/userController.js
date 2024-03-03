///-------------------------------- requiring modules   --------------------------------//////



const user = require('../models/userModel');
const bcrypt = require('bcrypt');

///--------------------------------    for converting password using bycrypt --------------------------------//////


const securepassword = async (password) => {

    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message)
    }
}


///------------------------------- for register page ---------------------------------//////


const loadregister = async (req, res) => {

    try {
        res.render('registration');

    } catch (error) {

        console.log(error.message);

    }
};


///------------------------   for inserting user into datbase ----------------------------------------//////



const insetUser = async (req, res) => {

    try {
        const spassword = await securepassword(req.body.password);
        const usersubmit = new user({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: spassword,
            is_admin: 0
        });

        const usredata = await usersubmit.save();

        if (usredata) {
            res.render('registration', { message: "your registration has been succesful." });
        } else {
            res.render('registration', { message: "your registration has been failed. please try again." });
        }

    } catch (error) {
        console.log(error.message);
    }

}

///-------------------------------   for login page  ---------------------------------//////


const loginLoad = async (req, res) => {

    try {

        res.render('login.ejs')

    } catch (error) {
        console.log(error.message);
    }
}


///------------------------------   to verify  login and redirect ----------------------------------//////



const verifylogin = async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const userdata = await user.findOne({ email: email });

        if (userdata) {

            const passwordmatch = await bcrypt.compare(password, userdata.password)
            if (passwordmatch) {

                req.session.user_id = userdata._id;
                res.redirect('/home');
            } else {
                res.render('login', { message: "email and password is incorrect" });
            }

        } else {
            res.render('login', { message: "email and password is incorrect" })
        }


    } catch (error) {
        console.log(error.message);
    }
}




///-------------------------   for  loading home  ---------------------------------------//////

const loadhome = async (req, res) => {
    try {


        const userdata1 = await user.findById({ _id: req.session.user_id })
        res.render('home', { user: userdata1 });

    } catch (error) {
        console.log(error.message);
    }
}

///------------------------   for loging out  and redirect into login page ----------------------------------------//////


const userLogout = async (req, res) => {

    try {
        req.session.destroy()

        res.redirect('/');

    } catch (error) {
        console.log(error.message);
    }

}


///----------------------------- for editing users -----------------------------------//////



const editLoad = async (req, res) => {
    try {

        const id = req.query.id;


        const userdata = await user.findById({ _id: id });

        if (userdata) {
            res.render('edit', { user: userdata });
        } else {
            res.redirect('/home');
        }

    } catch (error) {
        console.log(error.message);
    }
}



 ///-----------------------------  update profile  -----------------------------------//////


const updateProfile = async (req, res) => {

    try {
        if (req.file) {

        }
        else {
            const userData = await user.findByIdAndUpdate({ _id: req.body.user_id }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile } })
        }
        res.redirect('/home');


    } catch (error) {
        console.log(error.message);
    }
}


////////// exporting /////  ////////// exporting /////   ////////// exporting /////    ////////// exporting /////    ////////// exporting /////                                                                                                                                                                                                                                                                                                                                                                                                                                     

module.exports = {
    loadregister,
    insetUser,
    loginLoad,
    verifylogin,
    loadhome,
    userLogout,
    editLoad,
    updateProfile
}