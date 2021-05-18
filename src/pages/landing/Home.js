import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Image } from "antd";
import Signup from "pages/user/signup/Signup";
import "./Home.css";

import imageSample from "assets/images/background.jpg";

Home.propTypes = {};

function Home(props) {
  return (
    <div>
      <Row>
        <Col
          xs={24}
          xl={12}
          style={{
            padding: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image preview={false} src={imageSample} />
        </Col>
        <Col xs={24} xl={12} style={{ padding: 20 }}>
          <Signup />
        </Col>
      </Row>
    </div>
  );
}

export default Home;
