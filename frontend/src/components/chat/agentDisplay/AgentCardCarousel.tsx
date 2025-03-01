import Slider from "react-slick";
import AgentCard from "./AgentCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Agent } from "@/types/agents";

interface AgentCardCarouselProps {
  agents: Agent[];
}

export default function AgentCardCarousel({ agents }: AgentCardCarouselProps) {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: "0",
    focusOnSelect: true,
    className: "center-carousel",
    responsive: [
      {
        breakpoint: 4000,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "20%",
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "15%",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "0",
        },
      },
    ],
  };

  return (
    <div className="w-full relative mx-4">
      <div className="w-full">
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
