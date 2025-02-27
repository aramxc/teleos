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
    centerPadding: '60px',
    className: "center-carousel",
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 1,
          centerPadding: '40px',
          arrows: true,
        }
      }
    ]
  };

  return (
    <div className="w-screen -mx-4 sm:-mx-8 md:-mx-16 lg:-mx-32 mb-8">
      <div className="px-4 sm:px-8 md:px-16 lg:px-32 mr-6 relative">
        <div className="max-h-[340px] mb-16">
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