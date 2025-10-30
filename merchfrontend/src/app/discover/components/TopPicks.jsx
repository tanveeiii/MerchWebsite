import React from "react";

const TopPicks = () => {
  const image =
    "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800";

  return (
    // Wrap with an <a> tag to link to the new page
    <a
      href="/discover/top-picks"
      className="w-[45vw] mx-auto my-8 h-[70vh] flex flex-col justify-center items-center group"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">
        Top Picks
      </h2>
      <div className="relative w-full max-h-11/12 aspect-square rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-all cursor-pointer">
        <img
          src={image}
          alt="Top Pick"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay effect */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-white text-2xl font-semibold border-2 border-white px-6 py-3 rounded-lg">
            Shop Top Picks
          </span>
        </div>
      </div>
    </a>
  );
};

export default TopPicks;
