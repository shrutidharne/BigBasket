import React from "react";
import "./Success.css";
import { Link } from "react-router-dom";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const Success = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  console.log(orderInfo);
  return orderInfo ? (
    <>
      <div className="sccessMainDiv">
        <div className="successBodyDiv">
          <h1>Order Placed Succesfully</h1>
          <DoneAllIcon />
          <Link to={"/"} className="goToHomeLink">
            Home
          </Link>
        </div>
      </div>
    </>
  ) : (
    <>PAGE NOT FOUND</>
  );
};

export default Success;
