import React from 'react'

const Overview = () => {
    return (
        <div>
            <div className='text-lg text-gray-800'>Personal Information</div>
            <div className='bg-white shadow-sm border rounded-md p-4 text-[Poppins] '>
                <div className='flex mx-3 gap-10 my-4'>
                    <div className='flex flex-col gap-2'>
                        <div className='text-xs text-gray-500'>First Name</div>
                        <div className='bg-white shadow-sm border border-gray-400 w-[23vw] py-1.5 px-2 rounded-sm'>Tanvi</div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='text-xs text-gray-500'>Last Name</div>
                        <div className='bg-white shadow-sm border w-[23vw] border-gray-400 py-1.5 px-2 rounded-sm'>Agarwal</div>
                    </div>
                </div>
                <div className='flex flex-col gap-2 mx-3 my-4'>
                    <div className='text-xs text-gray-500'>Phone Number</div>
                    <div className='bg-white shadow-sm border w-[23vw] border-gray-400 py-1.5 px-2 rounded-sm '>9027906684</div>
                </div>
                <div className='flex flex-col gap-2 mx-3 my-4'>
                    <div className='text-xs text-gray-500'>Email-id</div>
                    <div className='bg-white shadow-sm border w-[23vw] border-gray-400 py-1.5 px-2 rounded-sm '>cse230001075@iiti.ac.in</div>
                </div>
            </div>
        </div>
    )
}

export default Overview