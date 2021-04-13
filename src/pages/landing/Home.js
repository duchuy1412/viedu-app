import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Image } from "antd";
import Signup from "pages/user/signup/Signup";
import "./Home.css";

Home.propTypes = {};

function Home(props) {
  return (
    <div>
      <Row>
        <Col xs={24} xl={12} style={{ padding: 50 }}>
          <Image
            preview={false}
            src="https://www.ninjatropic.com/wp-content/uploads/2020/09/Explaining-Complex-Topics-eLearning-Video.jpg"
          />
        </Col>
        <Col xs={24} xl={12}>
          <Signup />
        </Col>
      </Row>
    </div>
  );
}

export default Home;
