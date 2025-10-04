import React from "react";

const TrendSetter = () => {
  const trendsetters = [
    {
      title: "The Ultimate Tee Guide",
      designer: "Jessica Taylor",
      price: 17,
      image:
        "https://images.pexels.com/photos/8532389/pexels-photo-8532389.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "T-shirt Customization Tips",
      designer: "Brian White",
      price: 12,
      image:
        "https://images.pexels.com/photos/5710082/pexels-photo-5710082.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Unique Patterns",
      designer: "Sarah Davis",
      price: 10,
      image:
        "https://images.pexels.com/photos/4210863/pexels-photo-4210863.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Graphic Tees for Everyone",
      designer: "Anna Green",
      price: 14,
      image:
        "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">For Trendsetters</h2>
        <button className="text-sm font-medium hover:underline">
          Explore More
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {trendsetters.map((item, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="aspect-square rounded-2xl overflow-hidden mb-3 hover:shadow-lg transition-shadow">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <h3 className="font-bold text-sm mb-1">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-1">{item.designer}</p>
            <div className="flex justify-between items-center">
              <p className="font-bold">${item.price}</p>
              <button className="bg-black text-white text-xs px-3 py-1 rounded-full hover:bg-gray-800 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendSetter;
