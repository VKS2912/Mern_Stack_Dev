// import the model
const Menu = require('../Models/Menu');


// export the controller functionalities

exports.getMenuForRestaurant = (req, res) => {
    const restId = req.params.restId;
    Menu.find({
        restaurantId: restId
    }).then(result => {
        res.status(200).json({
            message: `Menu fetched for restaurant ${restId}`,
            menu: result
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Error in Database',
            error: error
        });
    });
}

