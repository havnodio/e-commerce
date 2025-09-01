import React from 'react';
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const images = [
  { src: "https://i.imgur.com/pkj2NTQ.jpeg", alt: "Delicious gourmet dish presentation" },
  { src: "https://i.imgur.com/N8cBKbB.jpeg", alt: "Fresh ingredients and cooking preparation" },
  { src: "https://i.imgur.com/jpihKku.jpeg", alt: "Restaurant interior ambiance" },
  { src: "https://i.imgur.com/46V4dv3.jpeg", alt: "Chef preparing specialty meal" },
  { src: "https://i.imgur.com/MBE4P1w.jpeg", alt: "Elegant food plating and presentation" },
];

const Gallery = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 7000, stopOnInteraction: true })
  );

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-2">
            Our Gallery
          </h2>
          <p className="text-muted-foreground text-lg">
            A glimpse into our world of flavor and artistry.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <Carousel
            plugins={[plugin.current]}
            opts={{
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="overflow-hidden shadow-lg">
                      <CardContent className="p-0">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-[500px] object-contain"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Gallery;