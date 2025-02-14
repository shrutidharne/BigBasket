import React, { useEffect, useState } from 'react'
// import { DataGridPremium, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid-premium';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, MenuItem } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import './UserList.css'
import Sidebar from './Sidebar'
import { useSelector, useDispatch } from 'react-redux'


//toast
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import NotAuthorised from '../Error/NotAuthorised';
import Loader from '../Loader/Loader';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';
import { getAllUsers, clearErrors, deleteUser, updateUser } from '../../actions/userActions';
import { Select } from '@mui/material';





const UserList = () => {
    const history = useNavigate();
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.allUsers)
    const { loading: loading1, user, isAuthenticated } = useSelector((state) => state.user);
    const { error: deleteError, isDeleted } = useSelector((state) => state.product);
    const RoleSelectCell = ({ value, row, onUpdate }) => {
        const [selectedRole, setSelectedRole] = useState(value);
        const handleRoleChange = (event) => {
            const newRole = event.target.value;
            setSelectedRole(newRole);
            onUpdate(row.id, newRole);
        };

        return (
            <Select className="roleChangeMenu"value={selectedRole} onChange={handleRoleChange} disabled={user._id === row.id}>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
            </Select>
        );
    };
    useEffect(() => {
        if (error) {
            console.log(error);
            toast.error(error);
            dispatch(clearErrors());
        }
        if (deleteError) {
            toast.error(deleteError);
            dispatch(clearErrors());
        }
        if (isDeleted) {
            toast.success(`Product Deleted Successfully!`);
            dispatch({ type: DELETE_PRODUCT_RESET });
        }

        dispatch(getAllUsers());
    }, [dispatch, error, deleteError, history, isDeleted])
    useEffect(() => {
        if (error) {
            console.log(error);
            toast.error(error);
            dispatch(clearErrors());
        }
    }, [error])

    const deleteProductHandler = (id) => {
        dispatch(deleteUser(id));
        toast.success("User Deleted Successfully!")
    }
    const handleRoleUpdate = (id, role) => {
        dispatch(updateUser(id, { role: role }));
    }
    const column = [
        { field: "id", headerName: "USER ID", minWidth: 200, flex: 0.8 },
        {
            field: "email",
            headerName: "Email",
            minWidth: 350,
            flex: 0.8
        },
        {
            field: "name",
            headerName: "Name",
            type: "number",
            minWidth: 150,
            flex: 0.3
        },
        {
            field: "phoneNo",
            headerName: "Phone No",
            type: "number",
            minWidth: 150,
            flex: 0.5
        },
        {
            field: "role",
            headerName: "Role",
            type: "number",
            minWidth: 70,
            flex: 0.3,
            cellClassName: (params) => {
                console.log(params.value);
                const cellValue = params.value;
                return cellValue === 'admin' ? 'greenColor' : 'redColor';
            },
            renderCell: (params) => (

                <RoleSelectCell
                    value={params.value}
                    row={params.row}
                    onUpdate={(userId, newRole) => handleRoleUpdate(userId, newRole)}
                />
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "number",
            minWidth: 150,
            sortable: false,
            flex: 0.3,
            renderCell: (params) => {
                return (<>
                    <Button disabled={user._id===params.row.id} onClick={() => deleteProductHandler(params.row.id)}>
                        <Delete />
                    </Button>
                </>)
            }
        }
    ]
    // console.log(users);
    const rows = [];
    users && users.forEach((item) => (
        rows.push({
            id: item._id,
            role: item.role,
            email: item.email,
            phoneNo: item.phoneNo.toString(),
            name: item.name,
        })
    ))
    // function CustomToolbar() {
    //     return (
    //         <GridToolbarContainer>
    //             <GridToolbarExport />
    //         </GridToolbarContainer>
    //     );
    // }
    return (
        <>
            {loading1 ? <Loader /> :
                (
                    isAuthenticated ? user.role === 'admin' ?
                        <div className="dashboard">
                            <Sidebar />
                            <div className="productListContainer">
                                <h1 id='productListHeading'>ALL USERS</h1>
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
                                        className='productListTable'
                                        slots={{ toolbar: GridToolbar }}
                                    />}
                            </div>

                        </div> : (<NotAuthorised />) : (

                        <NotAuthorised />
                    ))

            }
            <ToastContainer />
        </>
    )
}

export default UserList
