
import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import Carousel from "react-bootstrap/Carousel";

import bg from '../../assets/background.jpg'

const ii = <img src={bg} height='500px' width='100%' />;


function Home() {
    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine);
      }, []);
    return (
        <div className='home app-sub-component'>
            <Carousel style={{zIndex: 999}}>
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
            <Particles id="tsparticles" init={particlesInit} options={options} />
        </div>
    );
}

const options = {
    particles: {
        "fullScreen": {
            "enable": true,
            "zIndex": 0
        },
        number: {
            value: 60,
            density: {
                enable: true,
                area: 900
            }
        },
      color: "#272B8C",
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.7
      },
      size: {
        value: { min: 3, max: 5 }
      },
      links: {
        enable: true,
        distance: 100,
        color: "#808080",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 6,
        direction: "none",
        random: true,
        straight: false,
        outModes: "out"
      }
    },
    interactivity: {
      events: {
        onHover: {
          enable: false,
          mode: "grab"
        }
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 1
          }
        },
        push: {
          quantity: 4
        }
      }
    }
  };

export default Home;
