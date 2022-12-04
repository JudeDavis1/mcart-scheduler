import React from "react";
import Carousel from "react-bootstrap/Carousel";
import './Home.css';
import bg from '../../assets/background.jpg';
const ii = <img src={bg} height='500px' width='100%'/>;
function Home() {
    return (<div className='home app-sub-component'>
            <Carousel className="car">
                <Carousel.Item>
                {ii}
                <Carousel.Caption>
                    <h2>Example 1</h2>
                    <p>A screenshot of the product in action should be here</p>
                </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                {ii}
                <Carousel.Caption>
                    <h2>Example 2</h2>
                    <p>A screenshot of the product in action should be here</p>
                </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                {ii}
                <Carousel.Caption>
                    <h2>Example 2</h2>
                    <p>A screenshot of the product in action should be here</p>
                </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            <br />
            <h4 align='center'>
                An easy-to-use ministry cart scheduler that simplifies the scheduling process for trolly-work.
            </h4>
        </div>);
}
export default Home;
