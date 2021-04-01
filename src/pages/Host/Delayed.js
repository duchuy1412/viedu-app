import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

Delayed.propTypes = {
  waitBeforeShow: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};

function Delayed(props) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    let mounted = true;
    setTimeout(() => {
      if (mounted) setHidden(false);
    }, props.waitBeforeShow);

    return () => {
      mounted = false;
      setHidden(true);
    };
  }, [props.id]);

  return hidden ? <></> : props.children;
}

export default Delayed;
