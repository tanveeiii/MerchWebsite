"useClient"
import React from "react";

const CustomTees = () => {
  return (
      <section className="my-20 p-10 flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 rounded-3xl shadow-lg">
        <div className="flex-1">
          <div className="rounded-2xl overflow-hidden aspect-video">
            <img
              src="https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="T-shirt collection"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Sign up for exclusive deals and updates
            <br /> on the latest t-shirt designs.
          </h3>
          <button className="px-8 py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all font-medium hover:scale-105">
            Sign up
          </button>
        </div>
      </section>
  );
};

export default CustomTees;
