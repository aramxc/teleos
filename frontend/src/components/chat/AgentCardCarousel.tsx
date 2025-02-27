import Slider from "react-slick";
import AgentCard from './AgentCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Agent {
  name: string;
  description: string;
  websiteLink: string;
  tags: string[];
  icon: string;
  price: number;
}

interface AgentCardCarouselProps {
  agents: Agent[];
}

export default function AgentCardCarousel({ agents }: AgentCardCarouselProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    focusOnSelect: true,
    centerPadding: '0',
    className: "center-carousel",
    responsive: [
      {
        breakpoint: 4000,
        settings: {
          slidesToShow: 3,
          centerPadding: '0',
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          centerPadding: '0',
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          centerPadding: '0',
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          centerPadding: '0',
        }
      }
    ]
  };

  return (
    <div className="w-full relative px-8 sm:px-12 md:px-16 lg:px-20">
      <div className="max-w-[1200px] mx-auto">
        <Slider {...settings}>
          {agents.map((agent, index) => (
            <div key={index} className="px-2">
              <AgentCard agent={agent} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}