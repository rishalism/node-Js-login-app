////////  requiring  modulees ////////////


const User = require('../models/userModel');
const bcrypt = require('bcrypt');





///////////////////////////////////////   loading admin login   ///////////////////////////




const loadLogin = async (req, res) => {


    try {
        res.render('login');

    } catch (error) {
        console.log(error.message);
    }
}




///////////////////     to verify admin login   ///////////////////////////////////////////////




const verifyLogin = async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;


        const userdata = await User.findOne({ email: email });

        if (userdata) {


            const passwordmatch = await bcrypt.compare(password, userdata.password);

            if (passwordmatch) {

                if (userdata.is_admin === 0) {
                    res.render('login', { message: "email and password is incorrect" })
                }

                else {
                    req.session.user_id = userdata._id;
                    res.redirect('/admin/home')
                }

            } else {
                res.render('login', { message: "email and password is incorrect" })
            }


        } else {
            res.render('login', { message: "email and password is incorrest" })
        }

    } catch (error) {
        console.log(error.message);
    }
}




/////////////////////////////     for dashboard   ///////////////////////////// /////




const loaddashboard = async (req, res) => {
    try {

        const userdata = await User.findById({ _id: req.session.user_id })

        res.render('adminHome', { admin: userdata });
    } catch (error) {
        console.log(error.message);
    }
}



///////////////////////////   for loging out home admin page ///////////////////////////////////////




const logout = async (req, res) => {

    try {

        req.session.destroy();
        res.redirect('/admin')
    } catch (error) {
        error.message
    }
}

//////////////////////////        for admin dashboard  //////////////////////////////////////


const admindashboard = async (req, res) => {

    try {
        var search = '';
        if (req.query.search) {
            search = req.query.search;
        }   


        const userdata = await User.find({
            is_admin: 0,
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } },
                { mobile: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        })



        res.render('dashboard', { users: userdata });


    } catch (error) {

        console.log(error.message);

    }
}


//////////////////////////////        showing user /////////////////////////////////////////


const newuserload = async (req, res) => {
    try {

        res.render('newuser');
    } catch (error) {
        console.log(error.message);
    }
}



//////////////////////////////////////    Addding new  user   into database   /////////////////////////////////////////////////////////


const adduser = async (req, res) => {
    try {
        const password = req.body.password;

        const spassword = await securepassword(password);

        const useradd = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: spassword,
            is_admin: 0

        });

        const userData = await useradd.save();

        if (userData) {
            res.redirect('/admin/dashboard');
        } else {
            res.render('newuser', { message: 'Something went wrong.' });
        }



    } catch (error) {
        console.log(error.message);
    }


}



/////////////////////////////////////////   changing pasword into secure password usign bycrypt //////////////////////////////////////


const securepassword = async (password) => {

    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message)
    }
}


////////////////////////////////////////////////////////   for edit  user  ////////////////////////////////////////////////////////////



const edituser = async (req, res) => {
    try {


        const id = req.query.id;
        const userData = await User.findById({ _id: id });


        if (userData) {
            res.render('edituser', { user: userData });

        } else {
            res.redirect('/admin/dashboard');
        }

    } catch (error) {
        console.log(error.message);
    }
}


/////////////////////////////////////////////////////   for updating user    ////////////////////////////////////////////////////////////



const updateusers = async (req, res) => {
    try {

        const userdata = await User.findByIdAndUpdate({ _id: req.body.user_id }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile } })

        res.redirect('/admin/dashboard')

    } catch (error) {
        console.log(error.message);
    }
}




////////////////////////////////////////   for deleteing  userr    //////////////////////////////////////////////////////////





const deleteuser = async (req, res) => {
    try {

        const id = req.query.id;


        await User.deleteOne({ _id: id });

        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error.message);
    }
}

   
//////////////////////////////////////////    exporting   /////////////////////////////////////


module.exports = {
    loadLogin,
    verifyLogin,
    loaddashboard,
    logout,
    admindashboard,
    newuserload,
    adduser,
    edituser,
    updateusers,
    deleteuser
}