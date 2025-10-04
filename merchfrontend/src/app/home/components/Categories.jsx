const Categories = () => {
  const categories = [
    {
      name: "Graphic Tees",
      image:
        "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Plain Tees",
      image:
        "https://images.pexels.com/photos/8532389/pexels-photo-8532389.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Slogan Tees",
      image:
        "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-4xl font-bold mb-12">Popular Categories</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div key={category.name} className="group cursor-pointer">
            <div className="bg-gray-200 rounded-3xl overflow-hidden aspect-square mb-6 hover:shadow-xl transition-shadow">
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="w-48 h-48 rounded-full bg-white shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-center">{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
