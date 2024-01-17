import logo from './logo.svg';
import React, {useState} from 'react'
import './App.css';
//import Seek from './components/select'
import App2 from './Components/homepage'
import App1 from './Components/firstpage'
//import Choreo from './components/choreo'
//import Choreo1 from './components/choreo1'
//import Header from './components/header'
//import Player from './components/CreateChoreo1/Songs/trackplayer'
// import AHome from './components/home'
//import Upload from './components/choreo2'
// import Home from './components/choreo2home'
//import Login from './components/login'
// import {VideoItems} from './components/videosearch'
//import List from './components/listitems'
//import Pagination from './components/pagination'
// import HomePage from './components/homePage'
//import BKL from './components/optionsbar'
//import { BrowserRouter as Router, Link, Routes , Route } from 'react-router-dom';
function App() {
const [selectedValue, setSelectedValue] = useState('ui');

  return (
    <div className="App">
      {/* <AHome />
      <Header />
      <Choreo1 />
      <Choreo />
      <List />
      {/* <VideoItems /> */}
          {/* <div className="container">
            <Router>
                <nav className="nav">
                    <div className="nav-brand">Cloudinary Demo</div>
                    <ul className="nav-items">
                        <li className="nav-item">
                            <Link to="/">Gallery</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/upload">Upload</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route exact path="/upload" element={<Upload />}/>
                    <Route exact path="/" element={<Home />}  />
                </Routes>
            </Router>
        </div>  */}
            {/* <Login />  */}
            {/* <HomePage /> */}
        {/* <Pagination /> */}
        
        <App1 />
   
     
    </div>
  );
}

export default App;
