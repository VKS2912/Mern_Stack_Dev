import React from 'react';
import {useState, useEffect, useRef} from 'react'
const FilterPage = () => {
 const [location, setLocation] = useState("");
  const [selectedCusine, setSelectedCusine] = useState([]);
  const [selectedCostForTwo, setSelectedCostForTwo] = useState("");
  const [sort, setSort] = useState("");
  const [restaurantData, setRestaurantData] = useState([]);
  const radioRef = useRef(null); 

  const handleInputChange = event => {
    setLocation(event.target.value);
    fetchRestaurantData();
    console.log(location)
  };

  const handleCheckboxChange = event => {
    if (event.target.checked) {
      setSelectedCusine([...selectedCusine, event.target.value]);
      fetchRestaurantData();
    } else {
      setSelectedCusine(
        selectedCusine.filter(item => item !== event.target.value)
       
      );
       fetchRestaurantData();
    }
    console.log(selectedCusine)
  };

  const handleRadioChange = event => {
    if (event.target.name === "costForTwo") {
      setSelectedCostForTwo(event.target.value);
      fetchRestaurantData();
      console.log(selectedCostForTwo);
    } else {
      setSort(event.target.value);
      fetchRestaurantData();
      console.log(sort)
    }
    
    
  };

  // const handleSubmit = event => {
  //   event.preventDefault();
  //   fetchRestaurantData();
  // };

   const fetchRestaurantData = async () => {
     const response = await fetch(`/restdata?location=${location}&cusine=${selectedCusine}&costForTwo=${selectedCostForTwo}&sort=${sort}`);
     const data = await response.json();
     setRestaurantData(data);
     // store the returned data in a json file
    // you can use a library like 'file-saver' or 'jsonfile'
   }

   useEffect(() => {
     fetchRestaurantData();
   }, []);
  return (
    <div>
    <div style={{ height: '65px', width:'1519px', backgroundColor: '#ce0505' }}>
      <div style={{ 
       backgroundColor: '#ffffff',
        width: '52px', 
        height: '52px', 
        borderRadius: '50%', 
        position: 'absolute', 
        top: '5px', 
        left: '102px' 
      }}>
        <span style={{
          position: 'absolute',
          top: '1px',
          left: '16px',
          width: '32px',
          height: '47px',
          textAlign: 'left',
          font: 'normal normal 600 33px/50px Poppins',
          letterSpacing: '0px',
          color: '#EB2929',
          opacity: '1',
        }}>
          e!
        </span>
      </div>
      <button style={{
       backgroundColor: '#ce0505',
        position: 'absolute',
        top: '7px',
        left: '1084px',
        width: '111px',
        height: '46px',
        border: '1px solid #FFFFFF',
        borderRadius: '3px',
        opacity: '1',
      }}>
        <span style={{top: '29px',
                 left: '1015px',
                 width: '43px',
                 height: '23px',
                 textAlign: 'left',
                 font: 'normal normal medium 16px/25px Poppins',
                 letterSpacing: '0px',
                 color: '#FFFFFF',
                 opacity: '1'}}>Login</span>
      </button>
       <button style={{
       backgroundColor: '#ce0505',
        position: 'absolute',
        top: '7px',
        left: '1204px',
        width: '151px',
        height: '46px',
        border: '1px solid #FFFFFF',
        borderRadius: '3px',
        opacity: '1',
      }}>
        <span style={{top: '29px',
                 left: '1015px',
                 width: '43px',
                 height: '23px',
                 textAlign: 'left',
                 font: 'normal normal medium 16px/25px Poppins',
                 letterSpacing: '0px',
                 color: '#FFFFFF',
                 opacity: '1'}}>Create an account</span>
      </button>
    </div>
      <div style={{ backgroundColor: "#FAFBFC" }}>
        <h1 style={{ position: "absolute", top: "85px", left: "113px", font: "normal normal bold 36px/55px Poppins", letterSpacing: "0px", color: "#192F60" }}>
          Restaurants in location
        </h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr" }}>
        <div style={{ position: "relative", background: "#FFFFFF 0% 0% no-repeat padding-box", boxShadow: "0px 3px 6px #00000029", opacity: 1, top: "90px", left: "113px", width: "260px", height: "605px" }}>
          <h2 style={{ position: "absolute", top: "10px", left: "25px", textAlign: "left", font: "normal normal 600 18px/27px Poppins", letterSpacing: "0px", color: "#192F60", opacity: 1 }}>
            Filters
          </h2>
          <h4 style={{ position: "absolute", top: "38px", left: "35px", textAlign: "left", font: "normal normal normal 14px/21px Poppins", letterSpacing: "0px", color: "#192F60", opacity: 1 }}>
            Select Location
          </h4>
          <input type="text" placeholder="Select location" onChange={handleInputChange} style={{ position: "absolute", top: "60px", left: "35px", width: "208px", height: "30px", border: "1px solid #8C96AB", borderRadius: "3px", opacity: 1 }} />
          <h4 style={{ position: "absolute", top: "100px", left: "35px", textAlign: "left", font: "normal normal normal 14px/21px Poppins", letterSpacing: "0px", color: "#192F60", opacity: 1 }}>
            Cuisine
          </h4>
          <input type="checkbox" name="cuisine" value="north indian" onChange={handleCheckboxChange} style={{ position: "absolute", top: "125px", left: "5px", width: "86px", height: "20px", textAlign: "left", font: "normal normal normal 14px/21px Poppins", letterSpacing: "0px", color: "#8C96AB", opacity: 1 }} /> <span style={{ position: "absolute", top: "125px", left: "65px", width: "86px", height: "20px", textAlign: "left", font: "normal normal normal 14px/21px Poppins", letterSpacing: "0px", color: "#8C96AB", opacity: 1 }}>North Indian</span>
           <input type="checkbox" name="cuisine" value="north indian" onChange={handleCheckboxChange}  style={{ position: "absolute", top: "155px", left: "5px", width: "86px", height: "20px", textAlign: "left", font: "normal normal normal 14px/21px Poppins", letterSpacing: "0px", color: "#8C96AB", opacity: 1 }} /> <span style={{ position: "absolute", top: "155px", left: "65px", width: "86px", height: "20px", textAlign: "left", font: "normal normal normal 14px/21px Poppins", letterSpacing: "0px", color: "#8C96AB", opacity: 1 }}>South Indian</span>
            <input type="checkbox" name="cuisine" value="north indian" onChange={handleCheckboxChange}  style={{ position: "absolute", top: "185px", left: "5px", width: "86px", height: "20px", textAlign: "left", font: "normal normal normal 14px/21px Poppins", letterSpacing: "0px", color: "#8C96AB", opacity: 1 }} /> <span style={{ position: "absolute", top: "185px", left: "65px", width: "86px", height: "20px", textAlign: "left", font: "normal normal normal 14px/21px Poppins", letterSpacing: "0px", color: "#8C96AB", opacity: 1 }}>Chinese</span>
             <input type="checkbox" name="cuisine" value="north indian" onChange={handleCheckboxChange}  style={{ position: "absolute", top: "215px", left: "5px", width: "86px", height: "20px", textAlign: "left", font: "normal normal normal 14px/21px Poppins", letterSpacing: "0px", color: "#8C96AB", opacity: 1 }} /> <span style={{ position: "absolute", top: "215px", left: "65px", width: "86px", height: "20px", textAlign: "left", font: "normal normal normal 14px/21px Poppins", letterSpacing: "0px", color: "#8C96AB", opacity: 1 }}>Fast Food</span>
              <input type="checkbox" name="cuisine" value="north indian" onChange={handleCheckboxChange}  style={{ position: "absolute", top: "245px", left: "5px", width: "86px", height: "20px", textAlign: "left", font: "normal normal normal 14px/21px Poppins", letterSpacing: "0px", color: "#8C96AB", opacity: 1 }} /> <span style={{ position: "absolute", top: "245px", left: "65px", width: "86px", height: "20px", textAlign: "left", font: "normal normal normal 14px/21px Poppins", letterSpacing: "0px", color: "#8C96AB", opacity: 1 }}>Street Food</span>
          <h3 style={{
                position: 'absolute',
                top: '280px',
                left: '35px',
                textAlign: 'left',
                font: 'normal normal normal 14px/21px Poppins',
                letterSpacing: '0px',
                color: '#192F60',
                opacity: '1'
            }}>Cost For Two</h3>
            <input type="radio" name="costForTwo" value="lessthan500" checked={selectedCostForTwo === 'lessthan500'} onChange={handleRadioChange} style={{
                position: 'absolute',
                top: '310px',
                left: '1px',
                width: '104px',
                height: '20px',
                textAlign: 'left',
                letterSpacing: '0px',
                color: '#8C96AB',
                opacity: '1'
            }} /><span style={{
                position: 'absolute',
                top: '308px',
                left: '70px',
                width: '104px',
                height: '20px',
                textAlign: 'left',
                letterSpacing: '0px',
                color: '#8C96AB',
                opacity: '1'
            }}>less than 500</span>
             <input type="radio" name="costForTwo" value="500-1000" checked={selectedCostForTwo === '500-1000'} onChange={handleRadioChange} style={{
                position: 'absolute',
                top: '335px',
                left: '1px',
                width: '104px',
                height: '20px',
                textAlign: 'left',
                letterSpacing: '0px',
                color: '#8C96AB',
                opacity: '1'
            }} /><span style={{
                position: 'absolute',
                top: '333px',
                left: '70px',
                width: '104px',
                height: '20px',
                textAlign: 'left',
                letterSpacing: '0px',
                color: '#8C96AB',
                opacity: '1'
            }}>500-1000</span>
             <input type="radio" name="costForTwo" value="1000-1500" checked={selectedCostForTwo === '1000-1500'} onChange={handleRadioChange} style={{
                position: 'absolute',
                top: '362px',
                left: '1px',
                width: '104px',
                height: '20px',
                textAlign: 'left',
                letterSpacing: '0px',
                color: '#8C96AB',
                opacity: '1'
            }} /><span style={{
                position: 'absolute',
                top: '358px',
                left: '70px',
                width: '104px',
                height: '20px',
                textAlign: 'left',
                letterSpacing: '0px',
                color: '#8C96AB',
                opacity: '1'
            }}>1000-1500</span>
             <input type="radio" name="costForTwo" value="1500-2000" checked={selectedCostForTwo === '1500-2000'} onChange={handleRadioChange} style={{
                position: 'absolute',
                top: '388px',
                left: '1px',
                width: '104px',
                height: '20px',
                textAlign: 'left',
                letterSpacing: '0px',
                color: '#8C96AB',
                opacity: '1'
            }} /><span style={{
                position: 'absolute',
                top: '385px',
                left: '70px',
                width: '104px',
                height: '20px',
                textAlign: 'left',
                letterSpacing: '0px',
                color: '#8C96AB',
                opacity: '1'
            }}>1500-2000</span>
             <input type="radio" name="costForTwo" value="Morethan2000" checked={selectedCostForTwo === 'Morethan2000'} onChange={handleRadioChange} style={{
                position: 'absolute',
                top: '414px',
                left: '1px',
                width: '104px',
                height: '20px',
                textAlign: 'left',
                letterSpacing: '0px',
                color: '#8C96AB',
                opacity: '1'
            }} /><span style={{
                position: 'absolute',
                top: '410px',
                left: '70px',
                width: '104px',
                height: '20px',
                textAlign: 'left',
                letterSpacing: '0px',
                color: '#8C96AB',
                opacity: '1'
            }}>More than 2000</span>

            <h4 style={{
                position: 'absolute',
                top: '470px',
                left: '35px',
                width: '37px',
                height: '25px',
                textAlign: 'left',
                font: 'normal normal 600 18px/27px Poppins',
                letterSpacing: '0px',
                color: '#192F60',
                opacity: '1'
            }}>Sort</h4>
            <input type="radio" name="sort" value="pricehightolow" checked={selectedCostForTwo === 'pricehightolow'} onChange={handleRadioChange} style={{
                position: 'absolute',
                top: '500px',
                left: '1px',
                width: '114px',
                height: '20px',
                textAlign: 'left',
                font: 'normal normal normal 14px/21px Poppins',
                letterSpacing: '0px',
                color: '#8C96AB',
                opacity: '1'
            }} /><span style={{
                position: 'absolute',
                top: '500px',
                left: '75px',
                width: '114px',
                height: '20px',
                textAlign: 'left',
                font: 'normal normal normal 14px/21px Poppins',
                letterSpacing: '0px',
                color: '#8C96AB',
                opacity: '1'
            }}>Price High to Low</span>
            <input type="radio" name="sort" value="pricelowtohigh" checked={selectedCostForTwo === 'pricelowtohigh'} onChange={handleRadioChange} style={{
                position: 'absolute',
                top: '525px',
                left: '1px',
                width: '114px',
                height: '20px',
                textAlign: 'left',
                font: 'normal normal normal 14px/21px Poppins',
                letterSpacing: '0px',
                color: '#8C96AB',
                opacity: '1'
            }} /><span style={{
                position: 'absolute',
                top: '525px',
                left: '75px',
                width: '114px',
                height: '20px',
                textAlign: 'left',
                font: 'normal normal normal 14px/21px Poppins',
                letterSpacing: '0px',
                color: '#8C96AB',
                opacity: '1'
            }}>Price Low to High</span>
            </div>
            <div> <div className="restdet" style={{ position: "absolute", top: "170px", left: "430px", width: "794px", height: "291px", background: "#FFFFFF 0% 0% no-repeat padding-box", boxShadow: "0px 3px 6px #00000029", opacity: 1 }}>
            <div className="image" style={{ position: "absolute", top: "30px", left: "30px", width: "120px", height: "120px", borderRadius: "9px", opacity: 1, backgroundColor:"red" }}>
            </div>
            <span style={{ position: "absolute", top: "38px", left: "194px", width: "303px", height: "43px", textAlign: "left", font: "normal normal 600 30px/46px Poppins", letterSpacing: "0px", color: "#192F60", opacity: 1 }}>
                The Big Chill Cakery
            </span>
            <span style={{ position: "absolute", top: "75px", left: "209px", width: "370px", height: "48px", textAlign: "left", font: "normal normal medium 16px/30px Poppins", letterSpacing: "0px", color: "#636F88", opacity: 1 }}>fort</span>
            <span  style={{ position: "absolute", top: "99px", left: "200px", width: "370px", height: "23px", textAlign: "left", font: "normal normal normal 16px/30px Poppins", letterSpacing: "0px", color: "#636F88", opacity: 1 }}>
                shop1,plotd,andlawdalasan
            </span>
            <div style={{ position: "absolute", top: "189px", left: "10px", width: "726px", height: "0px", border: "1px solid #DEDFE5", opacity: 1 }}>
            </div>
            <span style={{ position: "absolute", top: "200px", left: "45px", width: "140px", height: "118px", textAlign: "left", font: "normal normal normal 16px/30px Poppins", letterSpacing: "0px", color: "#636F88", opacity: 1 }}>
                cusines
            </span>
            <span style={{ position: "absolute", top: "200px", left: "164px", width: "251px", height: "69px", textAlign: "left", font: "normal normal normal 16px/30px Poppins", letterSpacing: "0px", color: "#192F60", opacity: 1 }}>
                Bakery
            </span>
        </div></div>
    </div><div></div></div>)}
            export default FilterPage;