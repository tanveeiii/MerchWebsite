const Landing = () => {
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-16">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-orange-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          Tee Customs
        </h1>
        <button className="px-4 py-2 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all font-medium">
          Sign up / Sign in
        </button>
      </header>

      <section className="w-full flex flex-col text-center items-center">
        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Shop Vibrant{" "}
          <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Custom
          </span>{" "}
          <br /> T-Shirt Designs
        </h2>
        <p className="text-gray-600 mb-10 text-lg max-w-2xl">
          Explore thousands of unique t-shirts and personalize your style
        </p>
        <div className="flex gap-4 flex-col sm:flex-row">
          <button className="px-6 py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105">
            Start shopping
          </button>
          <button className="px-6 py-3 border-2 border-pink-400 rounded-lg font-medium hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 transition-all">
            Customize t-shirt
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center my-20">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-pink-50 hover:shadow-lg transition-shadow">
          <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            10K+
          </p>
          <p className="text-gray-600 mt-2 font-medium">Designs</p>
        </div>
        <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 hover:shadow-lg transition-shadow">
          <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
            500
          </p>
          <p className="text-gray-600 mt-2 font-medium">Catalog</p>
        </div>
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-orange-50 hover:shadow-lg transition-shadow">
          <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            100K+
          </p>
          <p className="text-gray-600 mt-2 font-medium">Happy Customers</p>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          Featured designs this week
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              id: 1,
              image:
                "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400",
            },
            {
              id: 2,
              image:
                "https://images.pexels.com/photos/5698853/pexels-photo-5698853.jpeg?auto=compress&cs=tinysrgb&w=400",
            },
            {
              id: 3,
              image:
                "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=400",
            },
            {
              id: 4,
              image:
                "https://images.pexels.com/photos/8532389/pexels-photo-8532389.jpeg?auto=compress&cs=tinysrgb&w=400",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="p-4 border-2 border-transparent hover:border-pink-300 rounded-2xl shadow-md hover:shadow-xl transition-all group"
            >
              <div className="rounded-lg mb-4 overflow-hidden aspect-square">
                <img
                  src={item.image}
                  alt={`Design ${item.id}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <p className="font-semibold mb-3">Custom Tee {item.id}</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all font-medium">
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </section>

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

      <footer className="flex flex-col sm:flex-row justify-between items-center py-6 border-t-2 border-pink-200 text-sm text-gray-600 gap-4">
        <p className="font-medium">TeeCustom © 2025</p>
        <div className="flex gap-6">
          <a
            href="#"
            className="hover:text-pink-600 transition-colors font-medium"
          >
            Instagram
          </a>
          <a
            href="#"
            className="hover:text-pink-600 transition-colors font-medium"
          >
            Twitter
          </a>
          <a
            href="#"
            className="hover:text-pink-600 transition-colors font-medium"
          >
            Facebook
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
