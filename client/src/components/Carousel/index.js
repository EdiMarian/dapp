import React from 'react'
import Carousel from 'react-bootstrap/Carousel';

const CarouselComponent = () => {
  return (
    <Carousel>
      <Carousel.Item interval={5000}>
        <a
          href="https://www.frameit.gg/marketplace/EQUISTAR-3f393f/sale"
          target="_blank" rel="noopener noreferrer"
        >
          <img
            className="d-block w-100"
            src="https://i.ibb.co/0mX9Q4s/frame-Mint.png"
          />
        </a>
      </Carousel.Item>
      <Carousel.Item interval={5000}>
        <a
          href="https://www.estar.games/whitepaper.pdf"
          target="_blank" rel="noopener noreferrer"
        >
          <img
            className="d-block w-100"
            src="https://i.ibb.co/X36m4wP/whitepaper.png"
          />
        </a>
      </Carousel.Item>
    </Carousel>
  )
}

export default CarouselComponent;
