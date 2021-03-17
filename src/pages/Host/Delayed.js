import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

Delayed.propTypes = {
  waitBeforeShow: PropTypes.number.isRequired,
  key: PropTypes.string.isRequired,
};

function Delayed(props) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setHidden(false);
    }, props.waitBeforeShow);

    return () => {
      setHidden(true);
    };
  }, [props.key]);

  return hidden ? <></> : props.children;
}

export default Delayed;
