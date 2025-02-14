import React from 'react'
import { Skeleton } from '@mui/material'
import './CardSkeleton.css'

const CardSkeleton = ({cards}) => {
  return Array(cards).fill(0).map((_, i) => (
    <div className='card-skeleton' key={i}>
      <div>
        <Skeleton variant="rectangular" width={'12vmax'} height={'12vmax'} />
      </div>
      <p ><Skeleton height={'2vmax'} /></p>
      <p > <Skeleton height={'2vmax'} /></p>
      <div > <Skeleton height={'3vmax'} /></div>
    </div>
  ))
}

export default CardSkeleton
