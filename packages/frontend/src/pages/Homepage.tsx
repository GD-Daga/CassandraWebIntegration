import React from "react";
import Ads from "src/components/AdsContainer";
import Card from "src/components/Card";
import ImageCarousel from "src/components/carousel";
import Gallery from "src/components/Gallery";
import HeroComponent from "src/components/hero";

const Homepage: React.FC = () => {
  const hero = {
    text: "Welcome to Tabing Kanto Singapore!",
    subText: "Your Essential Hub for Filipinos in Singapore!",
  };

  const images = [
    "https://images.pexels.com/photos/777059/pexels-photo-777059.jpeg?cs=srgb&dl=pexels-kin-pastor-251088-777059.jpg&fm=jpg",
    "https://cdn.britannica.com/55/190455-050-E617F64E/Night-view-Singapore.jpg",
    "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/il7jc87wZ_o8/v0/-1x-1.jpg",
    "https://entiretravel.imgix.net/getmedia/adf63348-5ed2-4c9c-b2ac-543b5570013e/Jewel-HSBC-Rain-Vortex-at-Night_1500x780.jpg?auto=format",
    "https://www.thoughtco.com/thmb/C1Nbj1M6jZK9Xm_lgD1ndDPPAk4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/singapore--garden-by-the-bay--supertree-grove-638256268-fa59e7e78b6449aaa40f68eafe6ff1a1.jpg",
  ];

  const cards = [
    {
      title: "Building with Tailwind CSS",
      description:
        "Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers.",
      linkText: "Read more",
      linkUrl: "#",
    },
    {
      title: "Start with Flowbite Design System",
      description:
        "Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers.",
      linkText: "Read more",
      linkUrl: "#",
    },
  ];

  return (
    <section className="flex-1">
      <div className="px-4 sm:px-6 md:px-10 pt-10 pb-4 mx-auto flex flex-col xl:flex-row gap-10">
        <div className="basis-3/5">
          <HeroComponent heroText={hero.text} heroSubtext={hero.subText} />
          <ImageCarousel
            images={images}
            autoSlide={true}
            autoSlideInterval={5000}
          />
          <div className="grid md:grid-cols-2 gap-8 pt-8">
            {cards.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                description={card.description}
                linkText={card.linkText}
                linkUrl={card.linkUrl}
              />
            ))}
          </div>
        </div>
        <div className="basis-2/5">
          <div className="flex flex-col gap-8">
            <Gallery />
            <Ads />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
