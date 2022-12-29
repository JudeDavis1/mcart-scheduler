import React from "react";
import Carousel from "react-bootstrap/Carousel";
import './Home.css';
import bg1 from '../../assets/background1.jpg';
import bg2 from '../../assets/background2.jpg';
import bg3 from '../../assets/background3.jpg';
const carItem = (bg) => <img src={bg} height="300px" width='100%'/>;
function Home() {
    return (<div className='home app-sub-component'>
            <Carousel className="car">
                <Carousel.Item>
                {carItem(bg1)}
                <Carousel.Caption>
                    <h2>Example 1</h2>
                    <p>A screenshot of the product in action should be here</p>
                </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                {carItem(bg2)}
                <Carousel.Caption>
                    <h2>Example 2</h2>
                    <p>A screenshot of the product in action should be here</p>
                </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                {carItem(bg3)}
                <Carousel.Caption>
                    <h2>Example 2</h2>
                    <p>A screenshot of the product in action should be here</p>
                </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            <br />
            <h4 align='center'>
                An easy-to-use ministry cart scheduler that simplifies the scheduling process for cart witnessing.
            </h4>
        </div>);
}
export default Home;
