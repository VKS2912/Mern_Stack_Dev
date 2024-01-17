// import the model
const User = require('../Models/Users');


// export the controller functionalities

exports.login = (req, res) => {

    const {
        username,
        password
    } = req.body;

    User.find({
        email: username,
        password: password
    }).then(result => {
        if (result.length > 0) {
            res.status(200).json({
                message: 'User logged in Successfully !!',
                isLoggedIn: true,
                user: result[0]
            });
        } else {
            res.status(400).json({
                message: 'Username or password is wrong',
                isLoggedIn: false
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Error in Database',
            error: error
        });
    });
}


exports.signup = (req, res) => {
    
    const {
        username,
        password,
        firstName,
        lastName
    } = req.body;

    // create an object of the User Model Class
    const userObj = new User({
        email: username,
        password: password,
        firstName: firstName,
        lastName: lastName
    });

    // call a save method on this Object
    userObj.save().then(result => {
        res.status(200).json({
            message: 'User signed up Successfully !!',
            user: result
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Error in Database',
            error: error
        });
    });
}

