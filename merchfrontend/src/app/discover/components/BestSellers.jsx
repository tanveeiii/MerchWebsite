import React from "react";

const BestSellers = () => {
  const bestSellers = [
    {
      title: "Best Sellers This Month",
      designer: "Kevin Morris",
      price: 20,
      image:
        "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Vintage Graphic Tee",
      designer: "Sophia Mitchell",
      price: 15,
      image:
        "https://images.pexels.com/photos/5698853/pexels-photo-5698853.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Minimalist Style",
      designer: "Liam Johnson",
      price: 25,
      image:
        "https://images.pexels.com/photos/8532389/pexels-photo-8532389.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Bold Statement Tee",
      designer: "Emma Thompson",
      price: 18,
      image:
        "https://images.pexels.com/photos/4066288/pexels-photo-4066288.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Nature Lover Tee",
      designer: "Oliver Brown",
      price: 22,
      image:
        "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Top Picks
          </h2>
          <button className="text-sm font-medium hover:underline">
            Check Them Out
          </button>
        </div>
        <div className="space-y-4">
          {bestSellers.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 group cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-colors"
            >
              <div className="text-2xl font-bold text-gray-300 w-8">
                {index + 1}
              </div>
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.designer}</p>
              </div>
              <p className="font-bold">${item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;
