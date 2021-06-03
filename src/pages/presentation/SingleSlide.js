import { PictureTwoTone } from "@ant-design/icons";
import { Col, Image, Row, Typography } from "antd";
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { resoleImageURI } from "util/ImageURI";

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
  const { isActive, text, image } = props;

  const slide = useSelector((state) => state.slides);

  return (
    <StyledSlide isActive={isActive}>
      <Row>
        <Col span={20} offset={2}>
          <Text style={{ width: "100%", fontWeight: "bold" }} ellipsis>
            {isActive
              ? slide.current.title
                ? slide.current.title
                : "No title"
              : text
              ? text
              : "No title"}
          </Text>
        </Col>
      </Row>
      <Row>
        <Col span={8}></Col>
        <Col span={8}>
          {isActive && slide.current.image && (
            <Image
              style={{ maxHeight: "100%" }}
              alt="media"
              preview={false}
              src={resoleImageURI(slide.current.image)}
            />
          )}

          {!isActive && image && (
            <Image
              style={{ maxHeight: "100%" }}
              alt="media"
              preview={false}
              src={resoleImageURI(image)}
            />
          )}
        </Col>
        <Col span={8}></Col>
      </Row>
    </StyledSlide>
  );
}

export default SingleSlide;
