import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="wrapper">
        <div className="inner" style={{ "--quantity": 10 }}>
          <div
            className="card"
            style={{ "--index": 0, "--color-card": "142, 249, 252" }}>
            <div className="img" />
          </div>
          <div
            className="card"
            style={{ "--index": 1, "--color-card": "142, 252, 204" }}>
            <div className="img" />
          </div>
          <div
            className="card"
            style={{ "--index": 2, "--color-card": "142, 252, 157" }}>
            <div className="img" />
          </div>
          <div
            className="card"
            style={{ "--index": 3, "--color-card": "215, 252, 142" }}>
            <div className="img" />
          </div>
          <div
            className="card"
            style={{ "--index": 4, "--color-card": "252, 252, 142" }}>
            <div className="img" />
          </div>
          <div
            className="card"
            style={{ "--index": 5, "--color-card": "252, 208, 142" }}>
            <div className="img" />
          </div>
          <div
            className="card"
            style={{ "--index": 6, "--color-card": "252, 142, 142" }}>
            <div className="img" />
          </div>
          <div
            className="card"
            style={{ "--index": 7, "--color-card": "252, 142, 239" }}>
            <div className="img" />
          </div>
          <div
            className="card"
            style={{ "--index": 8, "--color-card": "204, 142, 252" }}>
            <div className="img" />
          </div>
          <div
            className="card"
            style={{ "--index": 9, "--color-card": "142, 202, 252" }}>
            <div className="img" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .wrapper {
    width: 100%;
    height: 100vh;
    position: relative;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .inner {
    --w: 100px;
    --h: 150px;
    --translateZ: calc((var(--w) + var(--h)) + 0px);
    --rotateX: -15deg;
    --perspective: 1000px;
    position: absolute;
    width: var(--w);
    height: var(--h);
    z-index: 2;
    transform-style: preserve-3d;
    transform: perspective(var(--perspective));
    animation: rotating 20s linear infinite;
  }

  @keyframes rotating {
    from {
      transform: perspective(var(--perspective)) rotateX(var(--rotateX))
        rotateY(0);
    }
    to {
      transform: perspective(var(--perspective)) rotateX(var(--rotateX))
        rotateY(1turn);
    }
  }

  .card {
    position: absolute;
    border: 2px solid rgba(var(--color-card));
    border-radius: 12px;
    overflow: hidden;
    inset: 0;
    transform: rotateY(calc((360deg / var(--quantity)) * var(--index)))
      translateZ(var(--translateZ));
  }

  .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: radial-gradient(
      circle,
      rgba(var(--color-card), 0.2) 0%,
      rgba(var(--color-card), 0.6) 80%,
      rgba(var(--color-card), 0.9) 100%
    );
  }
`;

export default Loader;
