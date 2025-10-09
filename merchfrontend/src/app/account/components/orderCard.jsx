"use client";

export default function OrderCard({ status, date, deliveryDate, orderNo, image, delivered }) {
    return (
        <div className="bg-white shadow-sm border rounded-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[Poppins]">
            <div>
                <div className="flex flex-col">
                    <div className="text-gray-800 text-sm">ORDER STATUS:</div>
                    <div className="text-black uppercase">{status}</div>
                    <div className="text-sm text-green-600">{delivered ? "Delivered" : "Estimated delivery"} {deliveryDate}</div>
                    <div className="mt-2">
                        <img src={image} alt="product" className="w-20 rounded border" />
                    </div>
                    <div className="text-sm mt-2 text-gray-600">ORDER NO.: {orderNo}</div>
                    <div className="text-sm text-gray-600">ORDER DATE: {date}</div>
                </div>


            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
                {delivered ? (
                    <>
                        <button className="border border-black px-4 py-2 hover:bg-black hover:text-white transition">
                            TRACK PARCEL
                        </button>
                        <button className="border border-black px-4 py-2 hover:bg-black hover:text-white transition">
                            VIEW ORDER
                        </button>
                    </>
                ) : (
                    <>
                        <button className="border border-black px-4 py-2 hover:bg-black hover:text-white transition">
                            VIEW ORDER
                        </button>
                        <button className="border border-black px-4 py-2 hover:bg-black hover:text-white transition">
                            CANCEL ORDER
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
