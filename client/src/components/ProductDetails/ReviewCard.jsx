import { Rating } from "@mui/lab";
import React from "react";
import profilePng from "../../images/Profile.png";
import { Edit } from "@mui/icons-material";
const ReviewCard = ({ review, setOpen, setRating, setComment, user ,setIsEditing}) => {
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
  };
  const editHandler = () => {
    setRating(review.rating);
    setComment(review.comment);
    setIsEditing(true);
    setOpen(true);
  };
  return (
    <div className="reviewCard">
      <img src={profilePng} alt="User" />
      {user && user._id === review.user && <Edit onClick={editHandler} />}
      <p>{review.name}</p>
      <Rating {...options} />
      <span className="reviewCardComment">{review.comment}</span>
    </div>
  );
};

export default ReviewCard;
