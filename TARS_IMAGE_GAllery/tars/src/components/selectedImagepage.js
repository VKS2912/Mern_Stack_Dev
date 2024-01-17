import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Grid from '@material-ui/core/Grid'
import {Link} from 'react-router-dom'
import { Modal } from 'reactstrap';


const MainDiv = (props) => {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [topics, setTopics] = useState([]);
  const [results2, setResults2] = useState([]);
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
      
      setResults2(data)
    });
}, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${query}&&client_id=BYVguOvYfX76lRCFp2XW5ROkKODST7KOx_eKI69Heog`
      );
      setResults(response.data.results);
    };
    fetchData();
  }, [query]);

  useEffect(() => {
    const tagsArray = results.map((result) => result.tags.slice(0, 3));
    const flatTagsArray = tagsArray.flat();
    setTopics(flatTagsArray);
  }, [results]);
   function getStats(id){
     fetch(`https://api.unsplash.com/photos/${id}/statistics?client_id=BYVguOvYfX76lRCFp2XW5ROkKODST7KOx_eKI69Heog`)
    .then(response => response.json())
    .then(data => {
      console.log(data, "k");
      
      setPopupDownloads(data.downloads.total)
      setPopupLikes(data.likes.total)
    });
   }
   function getPhotoTags(id) {
       fetch(`https://api.unsplash.com/photos/${id}?client_id=BYVguOvYfX76lRCFp2XW5ROkKODST7KOx_eKI69Heog`)
    .then(response => response.json())
    .then(data => {
      console.log(data, "kjj");
      
      setPopupTags(data.tags)
       console.log(popuptags, "kjjlklk");
    });
   }
  

  function capitalizeFirstWord(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
  const capitalizedText = capitalizeFirstWord(query);
  const scrollLeft = () => {
    document.getElementById("container").scrollLeft -= 90;
  };

  const scrollRight = () => {
    document.getElementById("container").scrollLeft += 90;
  };
   
  
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

  return (<>
     <Modal size="lg" isOpen={popup}  >
      <button onClick={()=>{setPopup(false)}}style={{width:30,height:30,borderRadius:"50%",position:'absolute',right:-12,top:-12,border:'none'}}>X</button>
        {windowWidth>990 ? <> <Grid container style={{height:'auto'}}>
        <Grid item xs={12} style={{ height: '550px', background:` url(${popupBackground})`,backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center', }}>
          
             <div style={{ width: 50, height:50,position:'absolute',top:480,left:'3%',color:'white', textAlign:'center',border:"1px solid white" }}>Share</div>
           
              <div style={{ width: 50,height:50,padding:10, position:'absolute',top:480,left:'15%',textAlign:'center', color:'white',border:"1px solid white" }}>Info</div>
          
              <div style={{ width: 200,height:'auto',padding:10, position:'absolute',top:480,left:'65%',textAlign:'center', color:'white',backgroundColor:'#3CB46E',borderRadius:8}}>Download Image</div>
            
            
          </Grid>
        </Grid>
        <div style={{minHeight:'80px',backgroundColor:props.color,position:'relative'}}>
        
      <div style={{ background:` url(${popupprofileimage})`,backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center', borderRadius: '50%',width:60,height:60,position:'absolute',top:22,left:windowWidth>1100 ? "5%" : "2%" }} ></div>
  
            <span style={{position:'absolute',top:29,whiteSpace: "pre-wrap",fontWeight:'bold',color:props.color2,left:'15%',width:'160px'}} >{popupusername} <span style={{fontWeight:'normal',color:'grey',whiteSpace: "pre-wrap"}}> @{popupuserid}</span> </span>
           
            <span style={{position: 'absolute',whiteSpace: "pre-wrap",
left: windowWidth>1000?'33%':"39%",color:'#A7A7A7',top:50,
fontFamily: 'Poppins',
fontStyle: 'italic',
fontWeight: '600',
fontSize: '16px',
lineHeight: '18px'}} ><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.625 1.25H4.375C2.64911 1.25 1.25 2.64911 1.25 4.375V10.625C1.25 12.3509 2.64911 13.75 4.375 13.75H10.625C12.3509 13.75 13.75 12.3509 13.75 10.625V4.375C13.75 2.64911 12.3509 1.25 10.625 1.25Z" stroke="#A7A7A7" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
/{popupuserinstaid}</span>
            <span style={{position:'absolute',whiteSpace: "pre-wrap",fontFamily: 'Poppins',top:30,
fontStyle: 'italic',
fontWeight: '600',
fontSize: '16px',
lineHeight: '18px',color:'#A7A7A7',left:windowWidth>1000?'33%':"39%"}}><svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.4163 0.749999C12.8577 1.14403 12.2392 1.4454 11.5847 1.6425C11.2334 1.23855 10.7665 0.952236 10.2471 0.822289C9.72777 0.692342 9.18105 0.72503 8.68089 0.91593C8.18073 1.10683 7.75127 1.44673 7.45058 1.88967C7.1499 2.3326 6.9925 2.85719 6.99967 3.3925V3.97583C5.97454 4.00241 4.95875 3.77506 4.04276 3.31401C3.12678 2.85296 2.33903 2.17254 1.74967 1.33333C1.74967 1.33333 -0.583659 6.58333 4.66634 8.91667C3.46498 9.73215 2.03385 10.141 0.583008 10.0833C5.83301 13 12.2497 10.0833 12.2497 3.375C12.2491 3.21251 12.2335 3.05043 12.203 2.89083C12.7984 2.3037 13.2185 1.56241 13.4163 0.749999V0.749999Z" stroke="#A7A7A7" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
/{popupusertwiterid}</span>
            <span style={{position:'absolute',top:30,fontWeight:'normal',color:'#A7A7A7',left:windowWidth>1050?"67%":windowWidth<990?"58%":windowWidth<579?"39%":"65%",whiteSpace: "pre-wrap"}}>{popupdownloads} downloads</span>
            <span style={{position:'absolute',top:30,fontWeight:'normal',color:'#A7A7A7',whiteSpace: "pre-wrap",left:'86%'}}>
              
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.54492 16.0563L9.25742 18.1563C9.60742 18.5063 10.3949 18.6813 10.9199 18.6813H14.2449C15.2949 18.6813 16.4324 17.8938 16.6949 16.8438L18.7949 10.4563C19.2324 9.23126 18.4449 8.18126 17.1324 8.18126H13.6324C13.1074 8.18126 12.6699 7.74376 12.7574 7.13126L13.1949 4.33126C13.3699 3.54376 12.8449 2.66876 12.0574 2.40626C11.3574 2.14376 10.4824 2.49376 10.1324 3.01876L6.54492 8.35626" stroke="#858484" stroke-width="1.5" stroke-miterlimit="10"/>
<path d="M2.08252 16.0562V7.48125C2.08252 6.25625 2.60752 5.81875 3.83252 5.81875H4.70752C5.93252 5.81875 6.45752 6.25625 6.45752 7.48125V16.0562C6.45752 17.2812 5.93252 17.7187 4.70752 17.7187H3.83252C2.60752 17.7187 2.08252 17.2812 2.08252 16.0562Z" stroke="#858484" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
{popuplikes} likes</span>
          </div>
          <Grid item xs={12} style={{padding:20,backgroundColor:props.color}}>
            <div style={{color:props.color2,fontWeight:'bold',fontSize:'24px',margin:5}}>Related Tags</div>
            <div style={{height:'auto',backgroundColor:props.color,width:'100%',display: 'flex',
  flexWrap: 'wrap'}}>
             {popuptags.map((item)=>{
                 return(
                <Link to={`/second/${item.title}` } onClick={()=>{setPopup(false)}} style={{textDecoration:'none',color:props.color2, backgroundColor:props.color,
              height: "auto", whiteSpace: 'nowrap',width:'auto',
              border: "1px solid #ECECEC",borderRadius:"7px",
              margin: "5px 10px",textAlign:'center',padding:"5px"}}>
            <span  style={{
              fontSize:17,
              }}>{item.title}</span></Link>)
             })}</div>
          </Grid></>:<> <button onClick={()=>{setPopup(false)}}style={{width:30,height:30,borderRadius:"50%",position:'absolute',right:-12,top:-12,border:'none'}}>X</button> <Grid container style={{height:'auto'}}>
        <Grid item xs={12} style={{ height: '550px', background:` url(${popupBackground})`,backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center', }}>
          
              <div style={{ width: 50, height:50,position:'absolute',top:489,left:'3%',color:'white', textAlign:'center',border:"1px solid white" }}>Share</div>
           
              <div style={{ width: 50,height:50,padding:10, position:'absolute',top:480,left:'15%',textAlign:'center', color:'white',border:"1px solid white" }}>Info</div>
          
              <div style={{ width: 200,height:'auto',padding:10, position:'absolute',top:480,left:'55%',textAlign:'center', color:'white',backgroundColor:'#3CB46E',borderRadius:8}}>Download Image</div>
            
          </Grid>
        </Grid>
        <div style={{minHeight:'110px',backgroundColor:props.color,position:'relative'}}>
        
      <div style={{ background:` url(${popupprofileimage})`,backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center', borderRadius: '50%',width:60,height:60,position:'absolute',top:22,left:windowWidth>1100 ? "5%" : "2%" }} ></div>
  
            <span style={{position:'absolute',top:29,color:props.color2,whiteSpace: "pre-wrap",fontWeight:'bold',left:'15%',width:'160px'}} >{popupusername} <span style={{fontWeight:'normal',color:'grey'}}> @{popupuserid}                <span style={{
color:'#A7A7A7',
fontFamily: 'Poppins',
fontStyle: 'italic',
fontWeight: '600',
fontSize: '16px',
lineHeight: '18px'}} ><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.625 1.25H4.375C2.64911 1.25 1.25 2.64911 1.25 4.375V10.625C1.25 12.3509 2.64911 13.75 4.375 13.75H10.625C12.3509 13.75 13.75 12.3509 13.75 10.625V4.375C13.75 2.64911 12.3509 1.25 10.625 1.25Z" stroke="#A7A7A7" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
/{popupuserinstaid}               <span style={{fontFamily: 'Poppins',
fontStyle: 'italic',
fontWeight: '600',
fontSize: '16px',
lineHeight: '18px',color:'#A7A7A7'}}><svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.4163 0.749999C12.8577 1.14403 12.2392 1.4454 11.5847 1.6425C11.2334 1.23855 10.7665 0.952236 10.2471 0.822289C9.72777 0.692342 9.18105 0.72503 8.68089 0.91593C8.18073 1.10683 7.75127 1.44673 7.45058 1.88967C7.1499 2.3326 6.9925 2.85719 6.99967 3.3925V3.97583C5.97454 4.00241 4.95875 3.77506 4.04276 3.31401C3.12678 2.85296 2.33903 2.17254 1.74967 1.33333C1.74967 1.33333 -0.583659 6.58333 4.66634 8.91667C3.46498 9.73215 2.03385 10.141 0.583008 10.0833C5.83301 13 12.2497 10.0833 12.2497 3.375C12.2491 3.21251 12.2335 3.05043 12.203 2.89083C12.7984 2.3037 13.2185 1.56241 13.4163 0.749999V0.749999Z" stroke="#A7A7A7" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
/{popupusertwiterid}</span></span></span> </span>
           <span style={{position:'absolute',top:30,fontWeight:'normal',color:'#A7A7A7',left:windowWidth>1050?"67%":windowWidth<990?"58%":windowWidth<579?"39%":"65%",whiteSpace: "pre-wrap"}}>{popupdownloads} downloads                                             <span style={{fontWeight:'normal',color:'#A7A7A7'}}>
              
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.54492 16.0563L9.25742 18.1563C9.60742 18.5063 10.3949 18.6813 10.9199 18.6813H14.2449C15.2949 18.6813 16.4324 17.8938 16.6949 16.8438L18.7949 10.4563C19.2324 9.23126 18.4449 8.18126 17.1324 8.18126H13.6324C13.1074 8.18126 12.6699 7.74376 12.7574 7.13126L13.1949 4.33126C13.3699 3.54376 12.8449 2.66876 12.0574 2.40626C11.3574 2.14376 10.4824 2.49376 10.1324 3.01876L6.54492 8.35626" stroke="#858484" stroke-width="1.5" stroke-miterlimit="10"/>
<path d="M2.08252 16.0562V7.48125C2.08252 6.25625 2.60752 5.81875 3.83252 5.81875H4.70752C5.93252 5.81875 6.45752 6.25625 6.45752 7.48125V16.0562C6.45752 17.2812 5.93252 17.7187 4.70752 17.7187H3.83252C2.60752 17.7187 2.08252 17.2812 2.08252 16.0562Z" stroke="#858484" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
{popuplikes} likes</span></span>
           
          </div>
          <Grid item xs={12} style={{padding:20,backgroundColor:props.color}}>
            <div style={{color:props.color2,backgroundColor:props.color,fontWeight:'bold',fontSize:'24px',margin:5}}>Related Tags</div>
            <div style={{height:'auto',backgroundColor:props.color,width:'100%',display: 'flex',
  flexWrap: 'wrap'}}>
             {popuptags.map((item)=>{
                 return(
                <Link to={`/second/${item.title}` } onClick={()=>{setPopup(false)}} style={{textDecoration:'none',color:'grey', backgroundColor:'#ECECEC',
              height: "auto", whiteSpace: 'nowrap',width:'auto',
              border: "1px solid #ECECEC",borderRadius:"7px",
              margin: "5px 10px",textAlign:'center',padding:"5px",color:'#4F4F4F'}}>
            <span  style={{
              fontSize:17,
              }}>{item.title}</span></Link>)
             })}</div>
          </Grid></> }
     
      </Modal>

    <Grid container style={{ display: "flex", alignItems: "center" ,flexDirection: "column",overflowY: 'hidden',color:props.color2,backgroundColor:props.color }}>
   
     <div  style={{width:"100%",fontSize:39,paddingLeft:120,fontWeight:'bold',color:props.color2,backgroundColor:props.color}}>{capitalizedText}</div>
    
    <div style={{height:'auto',width:'89%',position:'relative',color:props.color2,backgroundColor:props.color,top:'5px'}}>
       <div style={{position:'absolute',left:"-1%",fontSize:35,cursor:'pointer'}} onClick={scrollLeft}>{"<"}</div>
      <div 
        id="container"
        style={{color:props.color2,backgroundColor:props.color,
          display: "flex",
          height: "auto",
          width: "100%",
          overflowX: "scroll",
          overflow:'hidden',
          scrollBehavior: "smooth",
          padding:10,
        }}
      >
      
        {topics.map((topic, index) => (
          <div
            key={index}
            style={{
              width: "auto",
              height: "auto", whiteSpace: 'nowrap',
              border: "1px solid lightGrey",borderRadius:"7px",
              margin: "0 10px",textAlign:'center',padding:"5px",color:props.color2
            }}
          ><Link to={`/second/${topic.title}` } style={{textDecoration:'none',color:props.color2}}>
            <span  style={{
              fontSize:16,
              }}>{topic.title}</span></Link>
          </div>
        ))} 
      </div><div onClick={scrollRight} style={{position:'absolute',right:"-5%",top:"-4%",fontSize:35,cursor:'pointer'}}>{">"}</div></div>
       
      <Grid container style={{paddingTop:0,paddingLeft:"30px",paddingRight:'30px',position:'relative',top:'6px'}} >
      {results.map((image, index) => {
        return (
         <Grid item xs={4} onClick={()=>{setPopup(true); setPopupBackground(image.urls.full);setPopupUserName(image.user.name);setPopupUserId(image.user.username);setPopupUserInstaId(image.user.instagram_username);setPopupUserTwiterId(image.user.twitter_username);setPopupProfileImage(image.user.profile_image.small);setPopupTags(image.tags);getStats(image.id);getPhotoTags(image.id);}} key={index} style={{padding:10}}>
        <div  key={index}
          style={{background: ` url(${image.urls.full})`,backgroundSize: 'cover',
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
        ><div style={{width:"100%",height:"auto",backgroundColor:props.color1,position:'absolute',bottom:0}}>
           <div style={{width:"100%",height:"auto",backgroundColor:props.color1}}>
          {image.sponsorship ? (
            <div style={{width:"40px",height:"40px",borderRadius:"50%",background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent), url(${image.sponsorship.sponsor.profile_image.small})`,backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',margin:10}}>
            </div>
          ):<div style={{width:"40px",height:"40px",borderRadius:"50%",background: 'lightgrey',margin:10}}>
            </div>}
             <span style={{position:'absolute',top:10,left:70,fontSize:'20px',color:props.color2}}>{image.user?.first_name}</span>
             <span style={{position:'absolute',top:34,left:75,fontSize:'15px',color:'grey'}}>@{image.user?.username}</span>
             <span style={{position:'absolute',top:'15px',right:'20px'}}>{image.likes}</span>
        </div></div></div>
        </Grid>)
})}
    </Grid>
    </Grid> 
    
    </>
  );
};

export default MainDiv;

