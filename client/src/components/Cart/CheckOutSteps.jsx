import React from "react";
import { Step, StepLabel, Stepper, Typography } from "@mui/material";
import { LocalShipping } from "@mui/icons-material";
import { LibraryAddCheck } from "@mui/icons-material";
import { AccountBalance } from "@mui/icons-material";
import "./CheckOutSteps.css";

const CheckOutSteps = ({ activeSteps }) => {
  const steps = [
    {
      label: <Typography>Shipping Details</Typography>,
      icon: <LocalShipping />,
    },
    {
      label: <Typography>Confirm Order</Typography>,
      icon: <LibraryAddCheck />,
    },
    {
      label: <Typography>Payment</Typography>,
      icon: <AccountBalance />,
    },
  ];

  const stepStyles = {
    boxSizing: "border-box",
  };

  return (
    <>
      <Stepper alternativeLabel activeSteps={activeSteps} className="stepsDiv">
        {steps.map((item, index) => (
          <Step
            key={index}
            active={activeSteps === index ? true : false}
            completed={activeSteps >= index ? true : false}
          >
            <StepLabel
              style={{
                color:
                  activeSteps >= index
                    ? "rgb(8, 187, 8)"
                    : "rgba(0, 0, 0, 0.649)",
              }}
              icon={item.icon}
            >
              {item.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </>
  );
};

export default CheckOutSteps;
