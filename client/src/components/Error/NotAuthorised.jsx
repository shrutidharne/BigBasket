import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

//toast
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { clearErrors } from '../../actions/userActions';
import './NotAuthorised.css'
import { Link } from 'react-router-dom';

const NotAuthorised = () => {
  // const dispatch = useDispatch();
  // const { error } = useSelector((state) => state.products);
  // useEffect(() => {
  //   if (error) {
  //     toast.error(error);
  //     dispatch(clearErrors());
  //   }
  // }, [dispatch,error])
  return (
    <div className='notFound'>
    <h1>404 NOT FOUND! </h1>
    <p>Please Return BACK</p>
    <Link to={'/'}>HOME</Link>
    <ToastContainer/>
    </div>
  )
}

export default NotAuthorised
