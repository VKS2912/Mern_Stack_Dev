// import the model
const Restaurant = require('../Models/Restaurants');


// export the controller functionalities

exports.getAllRestaurantsByLocation = (req, res) => {
    const cityName = req.params.cityName;
    Restaurant.find({
        city: cityName
    }).then(result => {
        res.status(200).json({
            message: `Restaurants fetched for city ${cityName}`,
            restaurants: result
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Error in Database',
            error: error
        });
    });
}

exports.getRestaurantById = (req, res) => {
    const restId = req.params.restId;
    Restaurant.find({
        _id: restId
    }).then(result => {
        res.status(200).json({
            message: `Restaurants fetched for id : ${restId}`,
            restaurant: result[0]
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Error in Database',
            error: error
        });
    });
}

exports.filterRestaurans = (req, res) => {
    // logic to filter the Restaurant data

    const { 
        location, 
        mealtype, 
        cuisine, 
        lcost, 
        hcost, 
        sort, 
        page = 1
    } = req.body;

    let filters = {};

    // add logic to apply filters

    if (mealtype) {
        filters.mealtype_id = mealtype;
    }

    if (location) {
        filters.location_id = location;
    }

    if (cuisine && cuisine.length > 0) {
        filters['cuisine.name'] = {
            $in: cuisine
        }
    }

    if (lcost && hcost) {
        if (lcost == 0) {
            filters.min_price = {
                $lt: hcost
            }
        } else {
            filters.min_price = {
                $gt: lcost,
                $lt: hcost
            }
        }
    }

    Restaurant.find(filters).sort({ min_price: sort }).then(result => {

        /*
        Assignment 6: write a logic to paginate the results:
        -> suppose after filtering you get 5 results
        -> but as per our design we only show 2 results on one page
        -> which means
            for page 1 : I need to show the first 2 results i.e. result[0] and result[1]
            for page 2 : I need to show the 3rd and 4th results i.e. result[2] and result[3]
            for page 3 : I need to show the 5th and the final result i.e. result[4]
        */

        const pageSize = 2;
        let tempArray = [];

        function paginate(arr, page_size, page_no) {
           let paginatedResult = [];
           paginatedResult = arr.slice(page_size * (page_no - 1) , page_size * page_no)
           return paginatedResult;
        }

        tempArray = paginate(result, pageSize, page);

        res.status(200).json({
            message: `Filtered Restaurants fetched`,
            restaurants: tempArray,
            totalResultsCount: result.length,
            pageNo: page,
            pageSize: pageSize
        });

    }).catch(error => {
        res.status(500).json({
            message: 'Error in Database',
            error: error
        });
    })
}

