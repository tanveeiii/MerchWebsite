import React from "react";

const TopPicks = () => {
  const topPicks = [
    {
      name: "Vibrant Graphic Tees",
      designer: "Alex Morgan",
      price: 20,
      image:
        "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400",
      tag: "View All",
    },
    {
      name: "Personalized Designs",
      designer: "Jordan Smith",
      price: 25,
      image:
        "https://images.pexels.com/photos/4066288/pexels-photo-4066288.jpeg?auto=compress&cs=tinysrgb&w=400",
      tag: "Shop",
    },
    {
      name: "Classic Styles",
      designer: "Taylor Johnson",
      price: 18,
      image:
        "https://images.pexels.com/photos/5698853/pexels-photo-5698853.jpeg?auto=compress&cs=tinysrgb&w=400",
      tag: "Discover",
    },
    {
      name: "Limited Edition Tees",
      designer: "Chris Evans",
      price: 22,
      image:
        "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=400",
      tag: "10%",
    },
    {
      name: "Eco-Friendly Prints",
      designer: "Patricia Brown",
      price: 15,
      image:
        "https://images.pexels.com/photos/8532389/pexels-photo-8532389.jpeg?auto=compress&cs=tinysrgb&w=400",
      tag: "5% Off",
    },
    {
      name: "Stylish T-shirt Collection",
      designer: "Michael Lee",
      price: 30,
      image:
        "https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?auto=compress&cs=tinysrgb&w=400",
      tag: "Shop Now",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          Top Picks
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {topPicks.map((item, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 hover:shadow-xl transition-all">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {item.tag && (
                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-bold">
                  {item.tag}
                </div>
              )}
            </div>
            <h3 className="font-bold text-sm mb-1">{item.name}</h3>
            <p className="text-gray-600 text-sm mb-1">{item.designer}</p>
            <p className="font-bold">${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPicks;
