import React from "react";

const MostGifted = () => {
  const image =
    "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800";

  return (
    <div className="w-[45vw] mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Top Picks</h2>
      <div className="relative max-h-11/12 aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer">
        <img
          src={image}
          alt="Top Pick"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  );
};

export default MostGifted;
