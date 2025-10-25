import React from 'react'
import { NavbarFinal } from '@/components/Navbar'
import ItemCard from '@/components/itemCard'

const Wishlist = () => {
    return (
        <div>
            <NavbarFinal/>
            <div className='grid grid-cols-4 mx-auto items-center justify-center'>
                <ItemCard/>
                <ItemCard/>
                <ItemCard/>
                <ItemCard/>
                <ItemCard/>
                <ItemCard/>
                <ItemCard/>
                <ItemCard/>
                <ItemCard/>
                <ItemCard/>
                <ItemCard/>
                <ItemCard/>
            </div>
            
        </div>
    )
}

export default Wishlist