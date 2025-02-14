import React, { useEffect } from "react";
// import { DataGridPremium, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid-premium';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import "./ProductList.css";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";

//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Link, useNavigate } from "react-router-dom";
import NotAuthorised from "../Error/NotAuthorised";
import Loader from "../Loader/Loader";
import {
  deleteOrder,
  getAllOrders,
  clearErrors,
} from "../../actions/orderActions";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";

const OrderList = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const {
    loading: loading1,
    user,
    isAuthenticated,
  } = useSelector((state) => state.user);
  const { error, orders } = useSelector((state) => state.allOrders);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.updateOrDeleteOrder
  );
  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      toast.success(`Order Deleted Successfully!`);
      dispatch({ type: DELETE_ORDER_RESET });
    }
  }, [dispatch, error, deleteError, history, isDeleted]);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };
  const column = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.4,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/order/${params.row.id}`}>
              <Edit />
            </Link>

            <Button onClick={() => deleteOrderHandler(params.row.id)}>
              <Delete />
            </Button>
          </>
        );
      },
    },
  ];
  const rows = [];
  orders &&
    orders.forEach((item) =>
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
        paymentMethod: item.paymentMethod,
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
            <div className="productListContainer">
              <h1 id="productListHeading">ALL ORDERS</h1>
              {
                // This is For CSV only download
                <DataGrid
                  rows={rows}
                  columns={column}
                  disableRowSelectionOnClick
                  className="productListTable"
                  slots={{ toolbar: GridToolbar }}
                />
              }
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

export default OrderList;
