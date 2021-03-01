import React from "react";
import { Row, Col, Typography } from "antd";
import PropTypes from "prop-types";
import styled from "styled-components";

SingleSlide.propTypes = {
  text: PropTypes.string,
};

const { Text } = Typography;

const StyledSlide = styled.div`
  height: 100%;
  color: dodgerblue;
  font-size: 1em;
  border: ${(props) =>
    props.isActive ? "3px solid dodgerblue" : "2px solid gainsboro"};
  &:hover {
    border: 2px solid dodgerblue;
    opacity: 0.5;
  }
  border-radius: 3px;
`;
function SingleSlide(props) {
  return (
    <StyledSlide isActive={props.isActive}>
      <Row>
        <Col span={20} offset={2}>
          <Text style={{ width: "100%", fontWeight: "bold" }} ellipsis>
            {props.text ? props.text : "No title"}
          </Text>
        </Col>
      </Row>
    </StyledSlide>
  );
}

export default SingleSlide;
