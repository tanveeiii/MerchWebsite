import React from 'react'

const Overview = () => {
    return (
        <div>
            <div className='text-lg text-gray-800'>Personal Information</div>
            <ul className='bg-white shadow-sm border rounded-md p-4 flex gap-2 items-start gap-4 text-[Poppins] '>
                <div className='flex flex-col'>
                    <li>Full Name: </li>
                    <li>Phone Number: </li>
                    <li>Email-id</li>
                </div>
                <div className='flex flex-col'>
                    <li>Tanvi Agarwal</li>
                    <li>9027906684</li>
                    <li>cse230001075@iiti.ac.in</li>
                </div>
            </ul>
        </div>
    )
}

export default Overview