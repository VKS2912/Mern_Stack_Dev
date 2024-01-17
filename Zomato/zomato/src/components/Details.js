import React, { Component } from 'react'
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import queryString from 'query-string';
import "react-tabs/style/react-tabs.css";
import "../styles/details.css";
import axios from 'axios';
const API_URL = require('../constants').API_URL;

const menuStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        background: 'white',
        zIndex: '10000000'
    }
}

Modal.setAppElement('#root')

export default class Details extends Component {

    constructor() {
        super();
        this.state = {
            restaurant: null,
            menu: null,
            isMenuOpen: false,
            totalPrice: 0
        }
    }

    componentDidMount() {
        const params = queryString.parse(this.props.location.search);
        const { id } = params;

        // get the details of the restaurant
        axios.get(`${API_URL}/getRestaurantById/${id}`)
            .then(resp => {
                this.setState({
                    restaurant: resp.data.restaurant
                })
            })
            .catch(err => {
                console.log(err);
            });

        // get the menu for the rstaurant
        axios.get(`${API_URL}/getMenuForRestaurant/${id}`)
            .then(resp => {
                this.setState({
                    menu: resp.data.menu
                })
            })
            .catch(err => {
                console.log(err);
            });

    }

    openMenu = () => {
        this.setState({
            isMenuOpen: true
        })
    }

    closeMenu = () => {
        this.setState({
            isMenuOpen: false
        })
    }

    addItemHandler = (item) => {
        const { totalPrice } = this.state;
        this.setState({
            totalPrice: totalPrice + item.itemPrice
        })
    }

    isDate = (val) => {
        return Object.prototype.toString.call(val) === '[object Date]';
    }

    isObj = (val) => {
        return typeof val === 'object';
    }

    stringifyValue = (value) => {
        if (this.isObj(value) && !this.isDate(value)) {
            return JSON.stringify(value);
        } else {
            return value;
        }
    }

    buildForm = (details) => {
        const { action, params } = details;
        const form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', action);
        Object.keys(params).forEach(key => {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', key);
            input.setAttribute('value', this.stringifyValue(params[key]));
            form.appendChild(input);
        })  
        return form;
    }

    postTheInformationToPaytm = (info) => {
        // build the form data
        const form = this.buildForm(info);

        // attach in the request body
        document.body.appendChild(form);

        // submit the form
        form.submit();

        // destroy the form
        form.remove();

    }

    getChecksum = (data) => {
        return fetch(`${API_URL}/payment`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(resp => {
            return resp.json();
        })
        .catch(err => {
            console.log(err);
        });
    }

    paymentHandler = () => {
        // add the logic to make the payment

        // (1) make API call to the BE and get the payment checksum
        const data = {
            amount: this.state.totalPrice,
            email: 'abhishek_saini@live.com',
            mobileNo: '9999999999'
        }

        this.getChecksum(data)
            .then(result => {
                // (2) go to the paytm website, on the paytm website, finish the payment
                let information = {
                    action: 'https://securegw-stage.paytm.in/order/process',
                    params: result
                }
                this.postTheInformationToPaytm(information);
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        const { restaurant, menu, isMenuOpen, totalPrice } = this.state;
        return (
            <>
                <div className="container details">
                    {
                        restaurant
                        ?
                        <>
                            <div className="images">
                                <Carousel showThumbs={false}>
                                    {
                                        restaurant.thumb.map((item, index) => {
                                            return (
                                                <div>
                                                    <img key={index} src={require(`../${item}`).default} alt="img"/>
                                                </div>
                                            )
                                        })
                                    }
                                </Carousel>
                            </div>
                            <div className="restName my-3">
                                { restaurant.name }
                                <button className="btn btn-danger float-end mt-4" onClick={this.openMenu}>Place Online Order</button>
                            </div>
                            <div className="myTabs mb-5">
                                <Tabs>
                                    <TabList>
                                        <Tab>Overview</Tab>
                                        <Tab>Contact</Tab>
                                    </TabList>
                                    <TabPanel>
                                        <div className="about my-5">About this place</div>
                                        <div className="cuisine">Cuisine</div>
                                        <div className="cuisines">
                                            {
                                                restaurant.cuisine.map((item, index) => {
                                                    return <span key={index}>{ item.name },</span>
                                                })
                                            }
                                        </div>
                                        <div className="cuisine mt-3">Average Cost</div>
                                        <div className="cuisines">₹{ restaurant.min_price } for two people (approx.)</div>
                                    </TabPanel>
                                    <TabPanel>
                                        <div className="cuisine my-5">Phone Number
                                            <div className="text-danger">{ restaurant.contact_number }</div>
                                        </div>
                                        <div className="cuisine mt-4">{ restaurant.name }</div>
                                        <div className="text-muted mt-2">
                                            { restaurant.locality } 
                                            <br/>
                                            { restaurant.city }
                                        </div>
                                    </TabPanel>
                                </Tabs>
                            </div>
                            <Modal isOpen={isMenuOpen} style={menuStyle}>
                                <h2>
                                    Menu
                                    <button onClick={this.closeMenu} className="btn btn-outline-danger float-end">X</button>
                                </h2>
                                <h5>{ restaurant.name }</h5>
                                <ul className="menu">
                                    {
                                        menu
                                        ?
                                        menu.map((item, index) => {
                                            return (
                                                <li key={index}>
                                                    <div className="row no-gutters menuItem my-3">
                                                        <div className="col-10">
                                                            <div className="row no-gutters">
                                                                <div className="cuisines col-10">{ item.itemName }</div>
                                                                <div className="cuisines col-2">&#8377; { item.itemPrice }</div>
                                                            </div>
                                                            {
                                                                item.isVeg
                                                                ?
                                                                <div className="text-success fs-6">Veg</div>
                                                                :
                                                                <div className="text-danger fs-6">Non-Veg</div>
                                                            }
                                                            <div className="cuisines">{ item.itemDescription }</div>
                                                        </div>
                                                        <div className="col-2">
                                                            <button className="btn btn-light addButton" onClick={() => this.addItemHandler(item)}>Add</button>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })
                                        :
                                        null
                                    }
                                </ul>
                                <div className="mt-3 restName fs-4">
                                    Subtotal <span className="m-4">&#8377; { totalPrice }</span>
                                    <button className="btn btn-danger float-end" onClick={() => this.paymentHandler()}>Pay Now</button>
                                </div>
                            </Modal>
                        </>
                        :
                        <div>Loading....</div>
                    }
                </div>
            </>
        )
    }
}
