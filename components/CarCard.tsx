use client;

import Slider from "react-slick";

export default function CarCard({ car }: { car: any }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="border rounded-lg shadow-md p-4">
      {/* Image Slider */}
      {car.photos && car.photos.length > 0 ? (
        <Slider {...settings} className="mb-3 rounded-md overflow-hidden">
          {car.photos.map((url: string, i: number) => (
            <img key={i} src={url} alt={car.make} className="w-full h-48 object-cover" />
          ))}
        </Slider>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span>No Image</span>
        </div>
      )}

      {/* Car Info */}
      <h3 className="text-lg font-semibold">{car.make} {car.model}</h3>
      <p>{car.year}</p>
      <p>{car.seats} seats · {car.bags} bags · {car.transmission}</p>
    </div>
  );
}