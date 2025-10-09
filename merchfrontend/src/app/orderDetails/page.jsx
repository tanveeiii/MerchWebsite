"use client"
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
            <div className='h-[25vh] border-[#8080802e] m-4 mt-4 rounded-md border-2 grid grid-cols-3 px-3 py-3 bg-white'>
                <div className='flex flex-col'>
                    <div>Ship to: </div>
                    <div className='text-sm'>House no./Apartment no.</div>
                    <div className='text-sm'>Street address</div>
                    <div className='text-sm'>City, state</div>
                    <div className='text-sm'>PinCode</div>
                </div>
                <div className='flex flex-col'>
                    <div>Payment method: </div>
                    <div className='text-sm'>Method</div>
                </div>
                <div className='flex flex-col'>
                    <div>Order summary: </div>
                    <div className='text-sm'>Item(s) subtotal: </div>
                    <div className='text-sm'>Shipping: </div>
                    <div >Total: </div>
                </div>
            </div>
            <div className='h-[30vh] border-[#8080802e] m-4 mt-4 rounded-md border-2 flex flex-row bg-white justify-between'>
                <div className='flex flex-row'>
                    <img src="https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=400" 
                        className=' object-contain h-full py-3 mx-3 mr-5'/>
                    <div className='flex flex-col  justify-around py-3'>
                        <div className='font-semibold'>Delivery Status</div>
                        <div>Bestseller-1</div>
                        <div>Price: 200 Rs.</div>
                        <div>Return Window</div>
                        <div className='grid grid-cols-2 gap-2'>
                            <button className=' text-white bg-slate-400 rounded-2xl px-2 py-1 cursor-pointer h-10'>Buy again</button>
                            <button className=' text-white bg-slate-400 rounded-2xl px-2 py-1 cursor-pointer '>View item</button>
                        </div>
                    </div>
                </div>
                    <div className='flex flex-col gap-5 m-9'>
                        <button className=' text-black border-black border-2 bg-white rounded-2xl px-2 py-1 cursor-pointer h-10'>Give a product review</button>
                        <button className=' text-black border-black border-2 bg-white rounded-2xl px-2 py-1 cursor-pointer h-10'>Check delivery status</button>
                    </div>
            </div>

        </div>
    </div>
  )
}

export default OrderDetails