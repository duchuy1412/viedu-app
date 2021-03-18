import React, { useEffect, useState } from "react";
import { Progress } from "antd";
import PropTypes from "prop-types";
import { clearInterval } from "stompjs";

ProgressBar.propTypes = {
  time: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};

function ProgressBar(props) {
  const [percent, setPercent] = useState(99);

  useEffect(() => {
    const inter = setInterval(() => {
      setPercent((percent) => (percent > 0 ? percent - 1 : 0));
    }, 50);

    return () => {
      setPercent(99);
      clearInterval(inter);
    };
  }, [props.id]);

  return (
    <>
      {percent > 0 ? (
        <Progress
          showInfo={false}
          strokeLinecap="square"
          percent={percent}
        ></Progress>
      ) : null}
    </>
  );
}

export default ProgressBar;
