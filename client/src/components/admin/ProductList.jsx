import React, { useEffect } from "react";
// import { DataGridPremium, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid-premium';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import "./ProductList.css";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  deleteProduct,
  getAdminProduct,
} from "../../actions/productActions";

//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import NotAuthorised from "../Error/NotAuthorised";
import Loader from "../Loader/Loader";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";

const ProductList = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const {
    loading: loading1,
    user,
    isAuthenticated,
  } = useSelector((state) => state.user);
  const { error, products } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );
  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      toast.success(`Product Deleted Successfully!`);
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
  }, [dispatch, error, deleteError, history, isDeleted]);
  useEffect(() => {
    dispatch(getAdminProduct());
  }, [dispatch]);
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    // console.log(error);
  }, [dispatch, error]);

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };
  const column = [
    { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 350,
      flex: 1,
      renderCell: (params) => {
        return (
          <Link to={`/product/${params.row.id}`} target="_blank">
            {params.row.name}
          </Link>
        );
      },
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 270,
      flex: 0.5,
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
            <Link to={`/admin/product/${params.row.id}`}>
              <Edit />
            </Link>
            <Button onClick={() => deleteProductHandler(params.row.id)}>
              <Delete />
            </Button>
          </>
        );
      },
    },
  ];
  const rows = [];
  products &&
    products.forEach((item) =>
      rows.push({
        id: item._id,
        stock: item.Stock,
        price: item.price,
        name: item.name,
      })
    );
  // function CustomToolbar() {
  //     return (
  //         <GridToolbarContainer>
  //             <GridToolbarExport />
  //         </GridToolbarContainer>
  //     );
  // }
  return (
    <>
      {loading1 ? (
        <Loader />
      ) : isAuthenticated ? (
        user.role === "admin" ? (
          <div className="dashboard">
            <Sidebar />
            <div className="productListContainer">
              <h1 id="productListHeading">ALL PRODUCTS</h1>
              {/* <DataGridPremium
                        rows={rows}
                        columns={column}
                        disableRowSelectionOnClick
                        className='productListTable'
                        slots={{ toolbar: CustomToolbar }}
                    /> */}

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

export default ProductList;
