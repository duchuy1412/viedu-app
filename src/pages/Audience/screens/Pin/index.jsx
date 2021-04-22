import { Button, Row, Col, Typography } from "antd";
import InputPIN from "pages/Audience/components/InputPIN";
import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { checkExistByPIN } from "util/APIUtils";

Pin.propTypes = {};

const { Text } = Typography;

function Pin(props) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("");

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
          // alert("PIN is not correct. Try again!");
          setStatus("PIN is not correct. Try again!");
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("An error has occurred!");
      });
  };

  const onChange = (value) => {
    setPin(value);
    setStatus("");
  };

  return (
    <div
      style={{
        height: "45vh",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <Row style={{ width: "100%" }}>
        <Col xs={24} xl={8}></Col>
        <Col xs={24} xl={8}>
          <div style={{ padding: 25 }}>
            <InputPIN
              value={pin}
              placeholder="Enter a PIN"
              onChange={onChange}
              maxLength={6}
              allowClear
              onPressEnter={hanldeJoin}
              autoFocus
            />
            <Button
              style={{ width: "100%", marginTop: 10 }}
              loading={loading}
              type="primary"
              onClick={hanldeJoin}
            >
              Join
            </Button>
            <Text type="danger">{status}</Text>
          </div>
        </Col>
        <Col xs={24} xl={8}></Col>
      </Row>
    </div>
  );
}

export default Pin;
