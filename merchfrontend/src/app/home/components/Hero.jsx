const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="p-8 md:p-12">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Explore Our Latest T-Shirt Designs
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Discover the trendiest t-shirts with unique designs that make a
              statement.
            </p>
            <button className="bg-black text-white px-8 py-4 rounded-md hover:bg-gray-800 transition-colors font-medium text-lg w-full md:w-auto">
              Shop Now
            </button>
          </div>

          <div className="relative h-80 md:h-full bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="grid grid-cols-5 gap-2 h-full">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg"
                  style={{
                    backgroundColor: [
                      "#2563eb",
                      "#dc2626",
                      "#059669",
                      "#7c3aed",
                      "#ea580c",
                      "#0891b2",
                      "#4f46e5",
                      "#64748b",
                      "#ec4899",
                      "#14b8a6",
                      "#8b5cf6",
                      "#f59e0b",
                      "#06b6d4",
                      "#10b981",
                      "#6366f1",
                      "#ef4444",
                      "#22c55e",
                      "#3b82f6",
                      "#a855f7",
                      "#f97316",
                    ][i % 20],
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
