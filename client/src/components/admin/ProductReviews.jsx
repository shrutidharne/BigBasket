import React, { useEffect, useState } from "react";
// import { DataGridPremium, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid-premium';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Delete, Star } from "@mui/icons-material";
import "./ProductReviews.css";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";

//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Link, useNavigate } from "react-router-dom";
import NotAuthorised from "../Error/NotAuthorised";
import Loader from "../Loader/Loader";
import {
  clearErrors,
  deleteReviews,
  getAllReviews,
} from "../../actions/productActions";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";

const ProductReviews = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const { error, reviews, loading } = useSelector(
    (state) => state.productReviews
  );
  const {
    loading: loading1,
    user,
    isAuthenticated,
  } = useSelector((state) => state.user);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.review
  );
  const [productId, setProductId] = useState("");
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      toast.success("Review Deleted Successfully!");
      history("/admin/reviews");
      dispatch({ type: DELETE_REVIEW_RESET });
      dispatch(getAllReviews(productId));
    }
  }, [dispatch, isDeleted, deleteError, error]);

  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteReviews(reviewId, productId));
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllReviews(productId));
  };

  const column = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "comment",
      headerName: "Comment",
      minWidth: 350,
      flex: 1,
    },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 270,
      flex: 0.5,
      cellClassName: (params) => {
        console.log(params.value);
        const cellValue = params.value;
        return cellValue >= 3 ? "greenColor" : "redColor";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      minWidth: 150,
      sortable: false,
      flex: 0.3,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => deleteReviewHandler(params.row.id)}>
              <Delete />
            </Button>
          </>
        );
      },
    },
  ];
  const rows = [];
  reviews &&
    reviews.forEach((item) =>
      rows.push({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        name: item.user,
      })
    );

  return (
    <>
      {loading1 ? (
        <Loader />
      ) : isAuthenticated ? (
        user.role === "admin" ? (
          <div className="dashboard">
            <Sidebar />
            <div className="productReviewsContainer">
              <form
                className="productReviewsForm"
                onSubmit={productReviewsSubmitHandler}
              >
                <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

                <div>
                  <Star />
                  <input
                    type="text"
                    placeholder="Product Id"
                    required
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                  />
                </div>

                <Button
                  id="createProductBtn"
                  type="submit"
                  disabled={
                    loading ? true : false || productId === "" ? true : false
                  }
                >
                  Search
                </Button>
              </form>

              {!loading && reviews && reviews.length > 0 ? (
                <DataGrid
                  rows={rows}
                  columns={column}
                  pageSize={10}
                  disableSelectionOnClick
                  className="productListTable"
                  autoHeight
                />
              ) : (
                <h1 className="productReviewsFormHeading">No Reviews Found</h1>
              )}
            </div>
          </div>
        ) : (
          <NotAuthorised />
        )
      ) : (
        <NotAuthorised />
      )}
      <ToastContainer />
    </>
  );
};

export default ProductReviews;
