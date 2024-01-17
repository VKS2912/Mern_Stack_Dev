import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import { FacebookProvider, LoginButton } from 'react-facebook';

const API_URL = require('../constants').API_URL;
const customStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '450px',
        background: 'white',
        zIndex: '10000000'
    }
}
Modal.setAppElement('#root')

class Header extends Component {

    constructor() {
        super();
        this.state = {
            backgroundStyle: '',
            isLoginModalOpen: false,
            isSignupModalOpen: false,
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            user: undefined,
            isLoggedIn: false,
            loginError: undefined,
            signUpError: undefined
        }
    }

    componentDidMount() {
        const initialPath = this.props.history.location.pathname;
        this.setHeaderStyle(initialPath);
        this.props.history.listen((location, action) => {
            this.setHeaderStyle(location.pathname);
        });
    }

    setHeaderStyle = (path) => {
        let bg = '';
        if (path === '/' || path === '/home') {
            bg = 'transparent';
        } else {
            bg = 'colored';
        }
        this.setState({
            backgroundStyle: bg
        });
    }

    navigate = (path) => {
        // logic to navigate on button click
        this.props.history.push(path);
    }

    openLoginModal = () => {
        this.setState({
            isLoginModalOpen: true
        });
    }

    closeLoginModal = () => {
        this.setState({
            isLoginModalOpen: false
        });
    }

    openSignUpModal = () => {
        this.setState({
            isSignupModalOpen: true
        });
    }

    closeSignUpModal = () => {
        this.setState({
            isSignupModalOpen: false
        });
    }

    loginHandler = () => {
        const { username, password } = this.state;
        const req = {
            username,
            password
        }
        axios({
            method: 'POST',
            url: `${API_URL}/login`,
            headers: { 'Content-Type': 'application/json' },
            data: req
        }).then(result => {
            const { user } = result.data;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', true);
            this.setState({
                user: user,
                isLoggedIn: true,
                loginError: undefined,
                isLoginModalOpen: false
            })
        }).catch(err => {
            console.log(err);
            this.setState({
                isLoggedIn: false,
                loginError: "Username or password is wrong"
            })
        });
    }

    cancelLoginHandler = () => {
        this.closeLoginModal();
    }

    signUpHandler = () => {
        const { username, password, firstName, lastName } = this.state;
        const req = {
            username,
            password,
            firstName,
            lastName
        }
        axios({
            method: 'POST',
            url: `${API_URL}/signup`,
            headers: { 'Content-Type': 'application/json' },
            data: req
        }).then(result => {
            const { user } = result.data;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', true);
            this.setState({
                user: user,
                isLoggedIn: true,
                signUpError: undefined,
                isSignupModalOpen: false
            })
        }).catch(err => {
            console.log(err);
            this.setState({
                isLoggedIn: false,
                signUpError: "Error Signing Up"
            })
        });
    }

    cancelSignUpHandler = () => {
        this.closeSignUpModal();
    }

    logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        this.setState({
            user: undefined,
            isLoggedIn: false
        });
    }

    handleChange = (e, field) => {
        const val = e.target.value;
        this.setState({
            [field]: val,
            loginError: undefined,
            signUpError: undefined
        })
    }

    // googleLoginHandler = (e) => {
    //     debugger
    //     // TODO: Learner task to continue with the login flow, fix the CSS
    // }

    // googleSignUpHandler = (e) => {
    //     debugger
    //     // TODO: Learner task to continue with the Signup flow, fix the CSS
    // }

    // handleFacebookResponse = (e) => {
    //     debugger
    //     // TODO: Learner task to continue with the login or Signup flow, fix the CSS
    // }

    // handleFacebookError = (e) => {
    //     debugger
    //     // TODO: Learner task to continue with the login or Signup flow, fix the CSS
    // }

    render() {
        const { 
            backgroundStyle, 
            isLoginModalOpen, 
            isSignupModalOpen, 
            isLoggedIn, 
            user,
            username,
            password,
            firstName,
            lastName,
            loginError,
            signUpError
        } = this.state;
        return (
            <div>
                <div className="page-header" style={{ 'background': backgroundStyle === 'transparent' ? 'transparent' : '#ce0505' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-6">
                                {
                                    backgroundStyle === 'transparent'
                                    ?
                                    null
                                    :
                                    <div className="logo-small" onClick={ () => this.navigate('/home') }>e!</div>
                                }
                            </div>
                            <div className="col-6 text-end align-self-center">
                                {
                                    isLoggedIn
                                    ?
                                    <>
                                        <span className="text-white m-4">{user.firstName}</span>
                                        <button className="btn btn-close-white" onClick={this.logout}>Logout</button>
                                    </>
                                    :
                                    <>
                                        <button className="btn btn-close-white" onClick={this.openLoginModal} >Login</button>
                                        <button className="btn btn-outline-light" onClick={this.openSignUpModal}>Create an Account</button>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Modal isOpen={isLoginModalOpen} style={customStyle}>
                    <h2>
                        Login
                        <button onClick={this.closeLoginModal} className="btn btn-outline-danger float-end">X</button>
                        <form className="mt-4">
                            {
                                loginError
                                ?
                                <div className="alert alert-danger text-center my-3 fs-6">{loginError}</div>
                                :
                                null
                            }
                            <input className="form-control" type="text" placeholder="email" required value={username} onChange={(e) => this.handleChange(e, 'username')} />
                            <input className="form-control my-3" type="password" placeholder="password" required value={password} onChange={(e) => this.handleChange(e, 'password')} />
                            <div className="text-center">
                                <input type="button" className="btn btn-primary m-2" onClick={this.loginHandler} value="Login" />
                                <button className="btn" onClick={this.cancelLoginHandler}>Cancel</button>
                            </div>
                            <div className="mt-4">
                                <FacebookProvider appId="XXXXXXXX">
                                    <LoginButton
                                    scope="email"
                                    onCompleted={this.handleFacebookResponse}
                                    onError={this.handleFacebookError}
                                    >
                                    <span>Login via Facebook</span>
                                    </LoginButton>
                                </FacebookProvider>
                                <br/>
                                <GoogleLogin 
                                    clientId="XXXXXXXXXXXXX.apps.googleusercontent.com"
                                    buttonText="Continue with google"
                                    onSuccess={this.googleLoginHandler}
                                    onFailure={this.googleLoginHandler}
                                    cookiePolicy={'single_host_origin'}
                                />
                            </div>
                        </form>
                    </h2>
                </Modal>
                <Modal isOpen={isSignupModalOpen} style={customStyle}>
                    <h2>
                        Sign Up
                        <button onClick={this.closeSignUpModal} className="btn btn-outline-danger float-end">X</button>
                        <form className="mt-4">
                            {
                                signUpError
                                ?
                                <div className="alert alert-danger text-center my-3 fs-6">{signUpError}</div>
                                :
                                null
                            }
                            <input className="form-control" type="text" placeholder="First Name" required value={firstName} onChange={(e) => this.handleChange(e, 'firstName')} />
                            <input className="form-control my-3" type="text" placeholder="Last Name" required value={lastName} onChange={(e) => this.handleChange(e, 'lastName')} />
                            <input className="form-control my-3" type="text" placeholder="email" required value={username} onChange={(e) => this.handleChange(e, 'username')} />
                            <input className="form-control my-3" type="password" placeholder="password" required value={password} onChange={(e) => this.handleChange(e, 'password')} />
                            <div className="text-center">
                                <input type="button" className="btn btn-primary m-2" onClick={this.signUpHandler} value="SignUp" />
                                <button className="btn" onClick={this.cancelSignUpHandler}>Cancel</button>
                            </div>
                            <div className="mt-4">
                                <FacebookProvider appId="XXXXXXXXX">
                                    <LoginButton
                                    scope="email"
                                    onCompleted={this.handleFacebookResponse}
                                    onError={this.handleFacebookError}
                                    >
                                    <span>Login via Facebook</span>
                                    </LoginButton>
                                </FacebookProvider>
                                <br/>
                                <GoogleLogin 
                                    clientId="XXXXXXXXXXXX.apps.googleusercontent.com"
                                    buttonText="Continue with google"
                                    onSuccess={this.googleSignUpHandler}
                                    onFailure={this.googleSignUpHandler}
                                    cookiePolicy={'single_host_origin'}
                                />
                            </div>
                        </form>
                    </h2>
                </Modal>
            </div>
        )
    }
}

export default withRouter(Header);
