import React from "react";
import PropTypes from "prop-types";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "./styles.css";

CountdownTimer.propTypes = {
  duration: PropTypes.number.isRequired,
};

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">Too lale...</div>;
  }

  return (
    <div className="timer">
      <div className="text">Remaining</div>
      <div className="value">{remainingTime}</div>
      <div className="text">seconds</div>
    </div>
  );
};

function CountdownTimer(props) {
  return (
    <CountdownCircleTimer
      isPlaying
      duration={props.duration}
      colors={[
        ["#004777", 0.33],
        ["#F7B801", 0.33],
        ["#A30000", 0.33],
      ]}
    >
      {renderTime}
    </CountdownCircleTimer>
  );
}

export default CountdownTimer;
