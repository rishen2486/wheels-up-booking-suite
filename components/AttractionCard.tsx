use client";

import Slider from "react-slick";

export default function AttractionCard({ attraction }: { attraction: any }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="border rounded-lg shadow-md p-4">
      {attraction.photos && attraction.photos.length > 0 ? (
        <Slider {...settings} className="mb-3 rounded-md overflow-hidden">
          {attraction.photos.map((url: string, i: number) => (
            <img key={i} src={url} alt={attraction.name} className="w-full h-48 object-cover" />
          ))}
        </Slider>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span>No Image</span>
        </div>
      )}

      <h3 className="text-lg font-semibold">{attraction.name}</h3>
      <p>{attraction.region}</p>
      <p>{attraction.details}</p>
    </div>
  );
}