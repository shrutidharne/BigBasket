import React from 'react'
import './Sidebar.css'
import { TreeItem, TreeView } from '@mui/lab'
import { ExpandMore, PostAdd, Add, ImportExport, Dashboard, People, RateReview, ListAlt } from '@mui/icons-material'

import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/">
        <h1>Home</h1>
      </Link>
      <Link to="/admin/dashboard">
        <p>
          <Dashboard /> Dashboard
        </p>
      </Link>
      <Link>
        <TreeView
          defaultCollapseIcon={<ExpandMore />}
          defaultExpandIcon={<ImportExport/>}
        >
          <TreeItem nodeId="1" label="Products"  className='treeItem'>
            <Link to="/admin/products">
              <TreeItem nodeId="2" label="All" icon={<PostAdd />} />
            </Link>

            <Link to="/admin/product">
              <TreeItem nodeId="3" label="Create" icon={<Add />}  />
            </Link>
          </TreeItem>
        </TreeView>
      </Link>
      <Link to="/admin/orders">
        <p>
          <ListAlt />
          Orders
        </p>
      </Link>
      <Link to="/admin/users">
        <p>
          <People /> Users
        </p>
      </Link>
      <Link to="/admin/reviews">
        <p>
          <RateReview />
          Reviews
        </p>
      </Link>
    </div>
  )
}


export default Sidebar
