import React from "react";

const CustomTees = () => {
  const customTees = [
    {
      title: "Creative Designs Await",
      designer: "Ava White",
      price: 30,
      image:
        "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400",
      tag: "Shop Now",
    },
    {
      title: "Unique Customizations",
      designer: "Noah Green",
      price: 12,
      image:
        "https://images.pexels.com/photos/4210863/pexels-photo-4210863.jpeg?auto=compress&cs=tinysrgb&w=400",
      tag: "Add to Cart",
    },
    {
      title: "Find Your Style",
      designer: "Mia Clark",
      price: 16,
      image:
        "https://images.pexels.com/photos/5698853/pexels-photo-5698853.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Trendy Casual, Comfortable",
      designer: "Lucas Harris",
      price: 19,
      image:
        "https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?auto=compress&cs=tinysrgb&w=400",
      tag: "Add to Cart",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-gradient-to-br from-purple-50 to-orange-50 rounded-3xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Shop Custom Tees</h2>
          <button className="text-sm font-medium hover:underline">
            Explore More
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {customTees.map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="aspect-square rounded-2xl overflow-hidden mb-3 hover:shadow-xl transition-shadow">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-sm mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-1">{item.designer}</p>
              <div className="flex justify-between items-center">
                <p className="font-bold">${item.price}</p>
                {item.tag && (
                  <button className="bg-black text-white text-xs px-3 py-1 rounded-full hover:bg-gray-800 transition-colors">
                    {item.tag}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomTees;
