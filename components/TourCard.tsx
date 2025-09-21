use client;

import Slider from "react-slick";

export default function TourCard({ tour }: { tour: any }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="border rounded-lg shadow-md p-4">
      {tour.photos && tour.photos.length > 0 ? (
        <Slider {...settings} className="mb-3 rounded-md overflow-hidden">
          {tour.photos.map((url: string, i: number) => (
            <img key={i} src={url} alt={tour.name} className="w-full h-48 object-cover" />
          ))}
        </Slider>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span>No Image</span>
        </div>
      )}

      <h3 className="text-lg font-semibold">{tour.name}</h3>
      <p>{tour.region}</p>
      <p>{tour.hours} hours</p>
      <p>{tour.details}</p>
    </div>
  );
}