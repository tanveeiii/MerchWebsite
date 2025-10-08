import { NavbarFinal } from '@/components/Navbar'
import React from 'react'
import Image from 'next/image'

const OrderDetails = () => {
  return (
    <div className=''>
        <NavbarFinal/>
        <div className='mt-10 w-9/12 font-[Poppins] bg-slate-100 h-[70vh] mx-auto rounded-md'>

            <div className='pt-2 ml-4 w-full text-[22px] font-[410]'>
                Order Details
            </div>
            <div className='h-[25vh] border-[#8080802e] m-4 mt-4 rounded-md border-2 grid grid-cols-3 px-3 py-3'>
                <div className='flex flex-col'>
                    <div>Ship to: </div>
                    <div>House no./Apartment no.</div>
                    <div>Street address</div>
                    <div>City, state</div>
                    <div>PinCode</div>
                </div>
                <div className='flex flex-col'>
                    <div>Payment method: </div>
                    <div>Method</div>
                </div>
                <div className='flex flex-col'>
                    <div>Order summary: </div>
                    <div>Item(s) subtotal: </div>
                    <div>Shipping: </div>
                    <div>Total: </div>
                </div>
            </div>
            <div className='h-[25vh] border-[#8080802e] m-4 mt-4 rounded-md border-2 flex flex-row'>
                <img src="https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=400" 
                       className=' object-contain h-full py-3 mx-3'/>
                <div className='flex flex-col py-3'>
                    <div>Bestseller-1</div>
                    <div>Price: 200 Rs.</div>
                    <div className='grid grid-cols-2 gap-2'>
                        <button className=' text-white bg-slate-400 rounded-2xl px-2 py-1 cursor-pointer '>Buy again</button>
                        <button className=' text-white bg-slate-400 rounded-2xl px-2 py-1 cursor-pointer '>View item</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default OrderDetails