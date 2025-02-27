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
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          centerPadding: '0',
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          centerPadding: '25%',
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: '15%',
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerPadding: '0',
        }
      }
    ]
  };

  return (
    <div className="w-screen -mx-7 sm:-mx-8 lg:-mx-60">
      <div className="px-12 sm:px-16 md:px-24 lg:px-40">
        <div className="max-h-[340px] mb-16 w-full relative">
          <Slider {...settings}>
            {agents.map((agent, index) => (
              <div key={index} className="px-2">
                <AgentCard agent={agent} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}