import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, Navigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { getUser } from '../../actions/userActions';
import Sidebar from './Sidebar.jsx'
import './Dashbord.css'
import { Typography } from '@mui/material';

//toast
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


import { clearErrors, getAdminProduct } from '../../actions/productActions';
import {getAllUsers} from '../../actions/userActions'
import NotAuthorised from '../Error/NotAuthorised';
import { getAllOrders } from '../../actions/orderActions';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { loading, user, isAuthenticated } = useSelector((state) => state.user);
    const { products, error } = useSelector((state) => state.products);
    const { error:orderError, orders ,loading:orderLoading} = useSelector((state) => state.allOrders);
    const {users}=useSelector((state)=>state.allUsers)
    useEffect(() => {
        dispatch(getAdminProduct());
        dispatch(getAllUsers());
        dispatch(getAllOrders());
    }, [dispatch])
    useEffect(() => {
        if (error) {
            console.log(error);
            toast.error(error);
            dispatch(clearErrors());
        }
    }, [error])
    return (
        <>
            {(loading || orderLoading)? <Loader /> :
                (
                    isAuthenticated ? user.role === 'admin' ?

                        <div className='dashboard'>
                            <Sidebar />
                            <div className='dashboardContainer'>
                                <Typography component='h1'>Dashboard</Typography>
                                <div className="dashboardSummary">
                                    <div>
                                        <p>
                                            Total Amount <br />2000
                                        </p>
                                    </div>
                                    <div className="dashboardSummaryBox2">
                                        <Link to={'/admin/products'}>
                                            <p>Products</p>
                                            <p>{products && products.length}</p>
                                        </Link>
                                        <Link to={'/admin/orders'}>
                                            <p>Orders</p>
                                            <p>{orders && orders.length}</p>
                                        </Link>
                                        <Link to={'/admin/users'}>
                                            <p>Users</p>
                                            <p>{users.length}</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <ToastContainer />
                        </div>


                        : (<NotAuthorised />) : (

                        <NotAuthorised />

                    )
                )
            }
        </>
    )
}

export default Dashboard
