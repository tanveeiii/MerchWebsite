import React from "react";

const Hero = () => {
  const heroSlides = [
    {
      title: "Vibrant Styles",
      subtitle: "Unique Custom Tees",
      buttonText: "Shop now",
      bgColor: "from-pink-100 to-orange-100",
    },
    {
      title: "New",
      subtitle: "from TeeCustoms",
      buttonText: "Explore",
      bgColor: "from-purple-100 to-pink-100",
    },
    {
      title: "20% OFF First Order",
      subtitle: "Use code 6WELCOME20A at checkout",
      bgColor: "from-orange-100 to-pink-100",
    },
  ];
  
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${slide.bgColor} rounded-3xl p-8 flex flex-col justify-between min-h-64 hover:shadow-xl transition-shadow`}
        >
          <div>
            <h2 className="text-4xl font-bold mb-2">{slide.title}</h2>
            <p className="text-gray-700 mb-6">{slide.subtitle}</p>
          </div>
          {slide.buttonText && (
            <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors w-fit">
              {slide.buttonText}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Hero;
