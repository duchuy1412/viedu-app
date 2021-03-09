import { Button } from "antd";
import InputPIN from "pages/Audience/components/InputPIN";
import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

Pin.propTypes = {};

function Pin(props) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const match = useRouteMatch();

  const hanldeJoin = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    // verify PIN and then allow user create name
    history.push(`${match.url}/name`, { pin: pin });
  };

  const onChange = (value) => {
    setPin(value);
  };

  return (
    <div>
      <InputPIN
        value={pin}
        placeholder="Enter a PIN"
        onChange={onChange}
        maxLength={6}
      />
      <Button loading={loading} type="primary" onClick={hanldeJoin}>
        Join
      </Button>
    </div>
  );
}

export default Pin;
