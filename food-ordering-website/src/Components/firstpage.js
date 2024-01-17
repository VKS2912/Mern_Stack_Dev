import React from "react";

const TopDiv = () => {
  
  return (
    <div className="topdiv" >
     <img
        src="background.jpg"
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: "0",
          left: "0",
        }}/>
      <div
        style={{
          position: "absolute",
          top: "81px",
          left: "686px",
          width: "147px",
          height: "147px",
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          borderRadius: "50%",
          opacity: 1
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "13px",
            left: "50px",
            width: "68px",
            height: "99px",
            textAlign: "left",
            font: "normal normal 600 114px Poppins",
            letterSpacing: "0px",
            color: "#EB2929",
            opacity: 1
          }}
        >
          e!
        </span>
      </div>
      <span
        style={{
          position: "absolute",
          top: "250px",
          left: "306px",
          width: "758px",
          height: "51px",
          textAlign: "left",
          font: "normal normal 600 36px/55px Poppins",
          letterSpacing: "0px",
          color: "#FFFFFF",
          opacity: 1
        }}
      ></span>
      <input
        placeholder="Enter Location"
        style={{
          position: "absolute",
          top: "339px",
          left: "312px",
          width: "245px",
          height: "60px",
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          opacity: 1
        }}
      />
      <div
        className="restaurant-search"
        style={{
          position: "absolute",
          top: "339px",
          left: "578px",
          width: "477px",
          height: "60px",
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          opacity: 1
        }}
      ></div>
    </div>
  );
};

export default TopDiv;
