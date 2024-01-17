import React, { Component } from 'react'
import queryString from 'query-string';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import '../styles/filter.css'
const API_URL = require('../constants').API_URL;

class Filter extends Component {

    constructor() {
        super();
        this.state = {
            mealName: '',
            mealType: 0,
            locations: [],
            selectedCityName: '',
            locationsInCity: [],
            selectedLocation: '',
            pageNo: 1,
            restaurantList: [],
            totalResults: 0,
            noOfPages: 0,
            cuisines: [],
            lCost: undefined,
            hCost: undefined,
            sortOrder: 1
        }
    }

    componentDidMount() {
        const params = queryString.parse(this.props.location.search);
        const { mealName, mealType } = params;
        this.setState({
            mealName,
            mealType
        })
        const city_id = localStorage.getItem('city_id');

        // make an API call to get the list of locations and filter by city_id
        axios.get(`${API_URL}/getAllLocations`)
            .then(resp => {
                const locations = resp.data.locations;
                const selectedCity = locations.find(city => city.city_id === parseInt(city_id));
                const selectedCityLocations = locations.filter(city => city.city_id === parseInt(city_id));
                this.setState({
                    locations,
                    selectedCityName: selectedCity.city,
                    locationsInCity: selectedCityLocations,
                    selectedLocation: selectedCityLocations[0].location_id,
                });
                setTimeout(() => {
                    this.filterRestaurants();
                }, 0);
            })
            .catch(err => {
                console.log(err);
            });
    }

    filterRestaurants = () => {
        // logic to filter the restaurants
        const {
            mealType,
            selectedLocation,
            cuisines,
            hCost,
            lCost,
            sortOrder,
            pageNo
        } = this.state;

        const req = {
            mealtype: mealType,
            location: selectedLocation,
            page: pageNo
        }

        if (cuisines.length > 0) {
            req.cuisine = cuisines;
        }

        if (hCost !== undefined && lCost !== undefined) {
            req.hcost = hCost;
            req.lcost = lCost;
        }

        if (sortOrder !== undefined) {
            req.sort = sortOrder;
        }

        axios({
            method: 'POST',
            url: `${API_URL}/filter`,
            headers: { 'Content-Type': 'application/json' },
            data: req
        }).then(result => {
            const { restaurants, totalResultsCount, pageNo, pageSize } = result.data;
            this.setState({
                pageNo: pageNo,
                restaurantList: restaurants,
                totalResults: totalResultsCount,
                noOfPages: Math.ceil((totalResultsCount/pageSize)),
            })
        }).catch(err => {
            console.log(err);
        });
    }

    handleLocationChange = (e) => {
        const location_id = e.target.value;
        this.setState({
            selectedLocation: location_id
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    handleCuisineChange = (e, cuisine) => {
        let { cuisines } = this.state;
        const index = cuisines.indexOf(cuisine);
        if (index < 0 && e.target.checked) {
            cuisines.push(cuisine);
        } else {
            cuisines.splice(index, 1);
        }
        this.setState({
            cuisines
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    handleCostChange = (e, lCost, hCost) => {
        this.setState({
            lCost: lCost,
            hCost: hCost
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    handleSortChange = (e, sortOrder) => {
        this.setState({
            sortOrder: sortOrder
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    handlePageChange = (page) => {
        if (page < 1) return;
        this.setState({
            pageNo: page
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    goToRestaurant = (rest) => {
        const url = `/details?id=${rest._id}`;
        this.props.history.push(url);
    }

    getPages = () => {
        const { noOfPages } = this.state;
        let pages = [];
        for (let i = 0; i < noOfPages; i++) {
            pages.push(
                <span key={i} className="pagination-box" onClick={() => this.handlePageChange(i + 1)}>{ i + 1 }</span>
            )
        }
        return pages;
    }

    render() {
        const { mealName, selectedCityName, locationsInCity, pageNo, restaurantList } = this.state;
        let currPage = pageNo;
        return (
            <>
                <div className="container my-3 page-heading">{mealName} Places in {selectedCityName}</div>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-5 col-lg-4 col-xl-3">
                            <div className="filterSection">
                                <div className="fs-heading my-2 mb-4">Filters</div>
                                <div className="fs-subheading my-2">Select Location</div>
                                <select className="location-box mb-4" onChange={(e) => this.handleLocationChange(e)}>
                                    <option value="">-- Select Location --</option>
                                    {
                                        locationsInCity.map((item, index) => {
                                            return <option key={index} value={item.location_id}>{item.name}</option>
                                        })
                                    }
                                </select>
                                <div className="fs-subheading my-2">Cuisine</div>
                                <div className="mb-4 sort-options">
                                    <div className="my-2">
                                        <input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'North Indian')} /> North Indian
                                    </div>
                                    <div className="my-2">
                                        <input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'South Indian')} /> South Indian
                                    </div>
                                    <div className="my-2">
                                        <input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'Chinese')} /> Chinese
                                    </div>
                                    <div className="my-2">
                                        <input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'Fast Food')} /> Fast Food
                                    </div>
                                    <div className="my-2">
                                        <input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'Street Food')} /> Street Food
                                    </div>
                                </div>
                                <div className="fs-subheading my-2">Cost For Two</div>
                                <div className="mb-4 sort-options">
                                    <div className="my-2">
                                        <input type="radio" name="cost" onChange={(e) => this.handleCostChange(e, 0, 500)} /> Less than &#8377; 500
                                    </div>
                                    <div className="my-2">
                                        <input type="radio" name="cost" onChange={(e) => this.handleCostChange(e, 500, 1000)} /> &#8377; 500 to &#8377; 1000
                                    </div>
                                    <div className="my-2">
                                        <input type="radio" name="cost" onChange={(e) => this.handleCostChange(e, 1000, 1500)} /> &#8377; 1000 to &#8377; 1500
                                    </div>
                                    <div className="my-2">
                                        <input type="radio" name="cost" onChange={(e) => this.handleCostChange(e, 1500, 2000)} /> &#8377; 1500 to &#8377; 2000
                                    </div>
                                    <div className="my-2">
                                        <input type="radio" name="cost" onChange={(e) => this.handleCostChange(e, 2000, 1000000)} /> &#8377; 2000+
                                    </div>
                                </div>
                                <div className="fs-heading my-2">Sort</div>
                                <div className="mb-4 sort-options">
                                    <div className="my-2">
                                        <input type="radio" name="sort" onChange={(e) => this.handleSortChange(e, 1)} /> Price low to high
                                    </div>
                                    <div className="my-2">
                                        <input type="radio" name="sort" onChange={(e) => this.handleSortChange(e, -1)} /> Price high to low
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-7 col-lg-8 col-xl-9">
                            <div className="resultSection px-2 px-md-3">
                                {
                                    restaurantList.length > 0
                                    ?
                                    restaurantList.map((item, index) => {
                                        return (
                                          <div key={index} className="row result-box" onClick={() => this.goToRestaurant(item)}>
                                                <div className="row">
                                                    <div className="col-4 col-md-5 col-lg-3 col-xl-2">
                                                        <img src={require('../Assets/breakfast.png').default} className="box-image" alt="img"/>
                                                    </div>
                                                    <div className="col-8 col-md-7 col-lg-9 col-xl-10">
                                                        <div className="box-heading text-truncate">{item.name}</div>
                                                        <div className="box-subheading text-truncate">{item.locality}</div>
                                                        <div className="box-text text-truncate">{item.city}</div>
                                                      </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-4 col-md-5 col-lg-3 col-xl-2 bottom-Text">
                                                        <div>CUISINES:</div>
                                                        <div>COST FOR TWO:</div>
                                                    </div>
                                                    <div className="col-8 col-md-7 col-lg-9 col-xl-10 bottom-Text-right">
                                                        <div>
                                                            {
                                                                item.cuisine.map((c, i) => {
                                                                    return <span key={i}>{c.name},</span>
                                                                })
                                                            }
                                                        </div>
                                                        <div>₹{item.min_price}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    <div className="text-danger text-center my-5">No Results Found</div>
                                }
                                {
                                    restaurantList.length > 0
                                    ?
                                    <div className="pagination-boxes">
                                        <span className="pagination-box" onClick={() => this.handlePageChange(--currPage)}>&#60;</span>
                                        {
                                            this.getPages()
                                        }
                                        <span className="pagination-box" onClick={() => this.handlePageChange(++currPage)}>&#62;</span>
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default withRouter(Filter);
