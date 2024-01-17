import React,{useState,useEffect} from "react"
import Grid from '@material-ui/core/Grid'
import {Routes, Route} from 'react-router-dom'
import Homepage from "./homepage"
import Secondpage from './selectedImagepage'
import axios from 'axios'
import { ImCross } from 'react-icons/im'
import {Link} from 'react-router-dom'

const Routing = () => {
  
 const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
const [show,setShow] = useState(0)
const [color, setColor] = useState('white');
const [color1, setColor1] = useState('white');
const [color2, setColor2] = useState('black');
 const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    setShowSearch(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setShowMenu(false);
  };
const handleClick = () => {
    setColor(color === 'white' ? '#232323' : 'white');
    setColor1(color1 === 'white' ? 'black' : 'white');setColor2(color2 === 'black' ? 'white' : 'black');
  };
 const crossClick = () => {
   setQuery([])
   setk([])
   setShow(0)
 }
const handleChange = (event,w) => {
    setShow(w)
    setQuery(event.target.value);
    if (event.target.value) {
      searchUnsplash(event.target.value);
    }else{setk([]);setShow(0)}
  };

  const searchUnsplash = async (query) => {
    const response = await axios.get(`https://api.unsplash.com/search/photos?query=${query}&&client_id=BYVguOvYfX76lRCFp2XW5ROkKODST7KOx_eKI69Heog`);
    setResults(response.data.results);
    console.log(results,"llo")
  };
  const [topics,setTopics]= useState([])
  useEffect(() => {
  console.log(results, "Rlla");
  setTopics([])
  results.map((item)=>{
    item.tags.map((item)=>{if(item.title.indexOf(query)!==-1){setTopics(pre=>[...pre,item.title])}})
  })
   
}, [results]); 
 

 const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

const [k,setk] = useState([])
useEffect(()=>{
   console.log(topics, "Tlla");
    const kl = [...new Set(topics)];
       setk(kl)
},[topics])
useEffect(()=>{
   console.log(k, "Qlla");
},[k])
useEffect(()=>{
   console.log(query, "Qlla");
},[query])
 return(<>
   <Grid item xs={12} style={{padding:20,height:70,backgroundColor:color}}>
          {windowWidth<900? <Grid container style={{height:'auto'}}>
      <Grid item xs={3} style={{fontSize:19,width:180,color:color2,fontWeight:'bold'}} className="gallery">Image Gallery</Grid>
      <Grid item xs={6}></Grid>
       <Grid item xs={2} style={{}}className="search">
        <button onClick={toggleSearch} style={{backgroundColor:color,border:0,position:'relative',left:34}}><svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9607 13L16.9443 18" stroke="#4F4F4F" stroke-width="1.5" stroke-linecap="round"/>
<path d="M14.2008 7.5C14.2008 11.2302 11.1874 14.25 7.47539 14.25C3.76338 14.25 0.75 11.2302 0.75 7.5C0.75 3.76975 3.76338 0.75 7.47539 0.75C11.1874 0.75 14.2008 3.76975 14.2008 7.5Z" stroke="#4F4F4F" stroke-width="1.5"/>
</svg>
</button>
        {showSearch && <><input onChange={(e)=>{handleChange(e,2)}} style={{position:'absolute',right:100}} type="text" placeholder="Search..." /><span onClick={()=>{setShowSearch(false)}}style={{position:'relative',cursor:'pointer',fontWeight:'bold',right:-79}} >X</span>
        <div style={{backgroundColor:color}}>
          {show===2 &&   <div style={{position:'absolute',top:46,left:0,backgroundColor:color,borderRadius:9,height:'auto',width:'100%',zIndex:90}}> 
          {
            k.map((iteml)=>{
              return(
                <Link to={`/second/${iteml}`} style={{textDecoration:'none',color:color2}}>
                <div style={{fontSize:'19px',margin:8,color:color2,fontWeight:"normal"}}>{iteml}</div></Link>
              )
            })
          }
          </div> }</div>
 
        
        </>}
      </Grid>
      <Grid item xs={1} className="menu"> 
                <button onClick={toggleMenu} style={{backgroundColor:color,border:0,position:'relative',right:9,zIndex:999}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 12H21" stroke="#4F4F4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 6H21" stroke="#4F4F4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 18H21" stroke="#4F4F4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</button>
        {showMenu && (
          <ul style={{zIndex:999,position:'absolute',right:'3px',backgroundColor:color,color:color2,listStyle:'none'}} >
            <li>Explore</li>
            <li>Collections</li>
            <li>Community</li>
            <li onClick={()=>handleClick()}>Darkmode</li>
          </ul>
        )}
      </Grid>
     
    </Grid> :

        <Grid container spacing={2}>
         <Grid item xs={3} style={{fontSize:"25px",fontWeight:"bolder",textAlign:"left",position:'relative',left:50,top:-7,color:color2}}>Image Gallery</Grid>
         <Grid item xs={3}><Grid container spacing={2} style={{border:'1px solid lightgrey',borderRadius:'15px',backgroundColor:'white',padding:2,position:'relative'}}>
          
          {show===1 && <> <ImCross onClick={()=>{crossClick()}} style={{position:'absolute',top:14,cursor:'pointer',left:'96%'}} size={12} color="#333" />
          <div style={{position:'absolute',top:46,backgroundColor:color,borderRadius:19
          ,height:'auto',width:'100%',zIndex:90}}> 
          {
            k.map((item)=>{
              return(
                <Link to={`/second/${item}` } style={{textDecoration:'none',color:color2}}>
            
                <div style={{fontSize:'16px',margin:8}}>{item}</div></Link>
              )
            })
          }
          </div></> }
          
          <Grid item xs={1} ><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
</svg></Grid>
         <Grid item xs={11} style={{backgroundColor:"white"}}><input placeholder="Search Images here" onChange={(e)=>{handleChange(e,1)}}  style={{marginLeft:4,width:'90%',border:"none",backgroundColor:'white',position:'relative',fontSize:"17px",top:'-2px'}} value={query}/>
         
         </Grid>
         </Grid>
         </Grid>
         <Grid item xs={1} style={{position:'relative',left:"10px",fontStyle:'poppins',fontWeight:"bold",color:color2}}>Explore</Grid>
         <Grid item xs={1} style={{position:'relative',left:"10px",fontStyle:'poppins',fontWeight:"bold",color:color2}}>Collection</Grid>
         <Grid item xs={1} style={{position:'relative',left:"20px",fontStyle:'poppins',fontWeight:"bold",color:color2}}>Community</Grid>
         <Grid item xs={3} style={{position:'relative',left:"69px",fontStyle:'poppins',cursor:'pointer',fontWeight:"bold",color:color2}} onClick={()=>handleClick()}>Dark Mode</Grid>
        </Grid>
       }</Grid>
  <Routes>
   <Route exact path="/" element={<Homepage color={color} color1={color1} color2={color2} />}/>
   <Route path="/second/:query" element={<Secondpage color={color} color1={color1} color2={color2}/>}/>
  </Routes></>
 )
}
export default Routing