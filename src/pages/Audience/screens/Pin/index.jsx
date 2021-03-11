import { Button } from "antd";
import InputPIN from "pages/Audience/components/InputPIN";
import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { checkExistByPIN } from "util/APIUtils";
Pin.propTypes = {};

function Pin(props) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const match = useRouteMatch();

  const hanldeJoin = async () => {
    setLoading(true);

    // verify PIN
    await checkExistByPIN(pin)
      .then((res) => {
        //then allow user create name
        if (res === true) {
          setLoading(false);
          history.push(`${match.url}/name`, { rootPath: match.url, pin: pin });
        } else {
          setLoading(false);
          alert("PIN is not correct. Try again!");
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("An error has occurred!");
      });
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
