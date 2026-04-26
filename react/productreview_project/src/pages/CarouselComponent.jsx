import green from "/src/assets/green.jpg";
import iphone from "/src/assets/white.png";
import smile from "/src/assets/smile.jpg";
import console from "/src/assets/console.jpg";
import find from "/src/assets/find.jpg";
import { Carousel } from "react-bootstrap";

function CarouselComponent() {
  return (
    <Carousel className="mb-4">
      <Carousel.Item>
        <img className="d-block w-100" src={green} alt="First slide" />
        <Carousel.Caption>
          <h3 style={{ color: "white" }}>Stay up-to-date with Shopified.</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={smile} alt="Second slide" />
        <Carousel.Caption>
          <h3>The answer to all of your questions.</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={find} alt="Third slide" />
        <Carousel.Caption className="slide3">
          <h3>Find what you love, love what you find.</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={console} alt="Fourth slide" />
        <Carousel.Caption className="slide4">
          <h3 style={{ color: "white" }}>Step into the future.</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={iphone} alt="Fifth slide" />
        <Carousel.Caption className="slide5">
          <h3>Stop Scrolling. Start Discovering.</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselComponent;
