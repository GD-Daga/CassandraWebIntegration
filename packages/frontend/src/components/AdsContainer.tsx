import React from "react";

const Ads: React.FC = () => {
  return (
    <div className="w-full h-fit bg-[#7c3732] rounded-lg p-4 md:p-8 gap-4">
      <h2 className="text-white text-2xl font-extrabold mb-4">Advertisement</h2>
      <img
        className="h-auto max-w-full rounded-lg"
        src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-9.jpg"
        alt="Gallery 1"
      />
    </div>
  );
};

export default Ads;
