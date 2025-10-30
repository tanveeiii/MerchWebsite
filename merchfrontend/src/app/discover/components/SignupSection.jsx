"useClient";
import React from "react";

const CustomTees = () => {
  return (
    <section className="my-20 mx-15 p-10 flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 rounded-xl shadow-lg">
      <div className="flex-1">
        <div className="rounded-xl overflow-hidden aspect-video">
          <img
            src="https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="T-shirt collection"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
          Sign up for exclusive deals and updates
          <br /> on the latest t-shirt designs.
        </div>
        {/* Wrap button in an <a> tag to link to the new page */}
        <a
          href="/signup"
          className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all font-medium hover:scale-105"
        >
          Sign up
        </a>
      </div>
    </section>
  );
};

export default CustomTees;
