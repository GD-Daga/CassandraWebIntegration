import React, { useState, useEffect } from 'react';

const AboutPage: React.FC = () => {
  const slides = [
    {
      title: "Discover Top Picks",
      description: "Curated listings of hotels, restaurants, and grocery stores, featuring both popular attractions and hidden gems.",
      imageUrl: "https://ik.imagekit.io/tvlk/blog/2022/09/landmark-ikonik-singapura.jpg?tr=q-70,c-at_max,w-500,h-250,dpr-2",
    },
    {
      title: "Plan with Ease",
      description: "User-friendly interface to compare locations, read genuine reviews, and customize your itinerary effortlessly.",
      imageUrl: "https://thepointsguy.global.ssl.fastly.net/us/originals/2021/04/TPG-App-Feature.jpg?width=3840",
    },
    {
      title: "Enhance Your Stay",
      description: "Resources to help you find the best accommodations, dining experiences, and local essentials to make your visit memorable.",
      imageUrl: "https://theroamingfork.com/wp-content/uploads/2023/04/Singapore-Fruit-Market-740x493.jpg?ezimgfmt=ng%3Awebp%2Fngcb1%2Frs%3Adevice%2Frscb1-1",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide interval set to 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
  };

  return (
    <section className="py-24 relative bg-gray-50">
      <div className="w-full max-w-7xl px-6 md:px-10 lg:px-12 mx-auto">
        

        {/* Carousel Section */}
        <div className="w-full flex flex-col items-center gap-6 relative">
          <div className="w-full lg:w-3/4 flex flex-col justify-center items-center border rounded-2xl shadow-lg bg-[#7c3732] p-8">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white font-manrope leading-snug text-center">
              {slides[currentSlide].title}
            </h2>
            <p className="text-lg text-mono font-normal text-white mb-6 text-center">
              {slides[currentSlide].description}
            </p>
            <div
              className="w-full relative rounded-3xl overflow-hidden shadow-xl transition-opacity duration-700 ease-in-out aspect-[16/9] cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                if (clickX < rect.width / 2) {
                  handlePrev();
                } else {
                  handleNext();
                }
              }}
            >
              <img
                className="w-full h-full object-cover opacity-100 transition-opacity duration-1000 ease-in-out"
                src={slides[currentSlide].imageUrl}
                alt={slides[currentSlide].title}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-20"></div>
            </div>

            {/* Circle Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {slides.map((_, index) => (
                <span
                  key={index}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-gray-400' : 'bg-white' 
                  }`}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
