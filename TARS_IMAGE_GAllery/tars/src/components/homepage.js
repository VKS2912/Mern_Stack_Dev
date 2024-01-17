import React,{useState,useEffect} from "react"
import Grid from '@material-ui/core/Grid'
import image from './mountphoto.jpg';
import axios from 'axios'
import { ImCross } from 'react-icons/im'
import {Link} from 'react-router-dom'
import { Modal } from 'reactstrap';

const Homepage = (props) => {
 
 const [images, setImages] = useState([]);
 const [yklu, setyklu] = useState([]);
 const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
const [show,setShow] = useState([])
const [popup,setPopup] = useState(false)
  const [popupBackground,setPopupBackground] = useState()
  const [popupusername,setPopupUserName] = useState()
  const [popupuserid,setPopupUserId] = useState()
  const [popupuserinstaid,setPopupUserInstaId] = useState()
  const [popupusertwiterid,setPopupUserTwiterId] = useState()
  const [popupdownloads,setPopupDownloads] = useState()
  const [popuplikes,setPopupLikes] = useState()
  const [popupprofileimage,setPopupProfileImage] = useState()
  const [popuptags,setPopupTags] = useState([])
useEffect(() => {
  fetch(`https://api.unsplash.com/photos/?client_id=BYVguOvYfX76lRCFp2XW5ROkKODST7KOx_eKI69Heog`)
    .then(response => response.json())
    .then(data => {
      console.log(data, "k");
      
      setyklu(data)
    });
}, []);

useEffect(() => {
  console.log(yklu, "ka");
}, [yklu]);
 const crossClick = () => {
   setQuery([])
   setk([])
 }
const handleChange = (event,w) => {
    setShow(w)
    setQuery(event.target.value);
    if (event.target.value) {
      searchUnsplash(event.target.value);
    }else{setk([])}
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

 return(
      <Grid container style={{backgroundColor:props.color}}>
       <Grid item xs={12} style={{background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent), url(${image})`,backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',height:"auto"}}>
        <Grid container>
         <Grid item xs={12} style={{height:140}}></Grid>
         <Grid item xs={12} style={{height:"auto",color:'white',fontSize:29,fontWeight:"bold",letterSpacing:'1px',textAlign:"center",marginBottom:7}}>
          Download High Quality Images By Creators
         </Grid>
         <Grid item xs={12} style={{height:"auto",color:'white',fontSize:14,fontWeight:"lighter",letterSpacing:'1px',textAlign:"center",margin:10}}>
          Over 2.4 million+ stock images by our talented community
         </Grid>
          <Grid item xs={12} style={{height:"auto",color:'white',fontSize:14,fontWeight:"lighter",letterSpacing:'1px',textAlign:"center",margin:10}}>
            <div style={{width:'60%',height:'40px',backgroundColor:"white",textAlign:'left',position:'relative',left:'20%',borderRadius:9}}>
           {show===2 &&   <div style={{position:'absolute',top:46,backgroundColor:props.color,borderRadius:9,height:'auto',width:'100%',zIndex:90}}> 
          {
            k.map((iteml)=>{
              return(
                <Link to={`/second/${iteml}`} style={{textDecoration:'none',color:props.color2}}>
                <div style={{fontSize:'19px',margin:8,color:props.color2,fontWeight:"normal"}}>{iteml}</div></Link>
              )
            })
          }
          </div> }
     

         
          <button style={{position:'relative',left:'2%',top:'20%',backgroundColor:'white',border:'none'}}> <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
</svg></button><input value={query} onChange={(e)=>{handleChange(e,2)}} placeholder="Search high resolution images, categories, wallpapers" style={{width:"70%",position:'relative',left:'3%',top:'9%',border:"none",fontSize:"15px"}} />
          </div>
         </Grid>
         <Grid item xs={12} style={{height:140}}></Grid>
        </Grid>
       </Grid>
       <Grid item xs={12}>
        <Grid container style={{paddingTop:0,paddingLeft:"30px",paddingRight:'30px'}} >
      {yklu.map((image, index) => {
        return (
         <Grid item xs={4} key={index} style={{padding:10}}>
        <div  key={index}
          style={{background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent), url(${image.urls.full})`,backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',border:"1px solid lightgrey",borderRadius:8,height:
                index % 9 === 0
                  ? "400px"
                  : index % 9 === 1
                  ? "250px"
                  : index % 9 === 2
                  ? "400px"
                  : index % 9 === 3
                  ? "250px"
                  : index % 9 === 4
                  ? "400px"
                  : index % 9 === 5
                  ? "250px"
                  : index % 9 === 6
                  ? "400px"
                  : index % 9 === 7
                  ? "400px"
                  : "400px",
                  position:'relative',top:index%9===4 ? "-150px" : index>5 ? "-150px" : "0px"}}
        ><div style={{width:"100%",height:"auto",backgroundColor:props.color,position:'absolute',bottom:0}}>
           <div style={{width:"100%",height:"auto",backgroundColor:props.color}}>
          {image.sponsorship ? (
            <div style={{width:"40px",height:"40px",borderRadius:"50%",background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent), url(${image.sponsorship.sponsor.profile_image.small})`,backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',margin:10}}>
            </div>
          ):<div style={{width:"40px",height:"40px",borderRadius:"50%",background: 'lightgrey',margin:10}}>
            </div>}
             <span style={{position:'absolute',whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',top:10,left:70,fontSize:'20px',color:props.color2}}>{image.user?.first_name}</span>
             <span style={{position:'absolute',whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',top:34,left:75,fontSize:'15px',color:'grey'}}>@{image.user?.username}</span>
             <span style={{position:'absolute',whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',top:'15px',right:'20px',color:props.color2}}>{image.likes}</span>
        </div></div></div>
        </Grid>)
})}
    </Grid>
       </Grid>
      </Grid>
 )
}

export default Homepage;