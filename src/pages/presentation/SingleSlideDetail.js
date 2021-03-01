import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Divider,
  Row,
  Col,
  Checkbox,
  Select,
  Slider,
  message,
} from "antd";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

import { updateToPresentation } from "./../../util/APIUtils";
import score from "./../../util/score";

SingleSlideDetail.propTypes = {};

const { Option } = Select;

const StyledSlide = styled.div`
  background: white;
  height: 100%;
  color: dodgerblue;
  font-size: 1em;
  border: 1px solid gainsboro;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TitleInput = styled(Input)`
  font-size: 3em;
  font-weight: bold;
  border: 2px solid dodgerblue;
  border-radius: 3px;

  margin: ${(props) => props.size};
  padding: ${(props) => props.size};
`;

const OptionInput = styled(Input)`
  color: dodgerblue;
  font-size: 2em;
  border: 2px solid dodgerblue;
  border-radius: 3px;

  margin: 5px;
  padding: ${(props) => props.size};
`;

function SingleSlideDetail(props) {
  const { content } = props;
  const { presentation } = props;

  const [form] = Form.useForm();

  let formValues = content;

  function onChange(changedValues, allValues) {
    // console.log("Change value: ", changedValues);
    // console.log("All value: ", allValues);
    formValues = { ...formValues, ...allValues };
  }

  useEffect(() => {
    form.setFieldsValue({
      title: content.title,
      answers: content.answers
        ? content.answers
        : [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
      score: content.score,
      seconds: content.seconds,
      questionType: content.questionType,
    });
  });

  // useEffect(() => {
  //       updateToPresentation(question, presentation)
  //         .then((response) => message.success("Saved changes"))
  //         .catch((error) => message.error("Error"));

  // }, [question]);

  return (
    <StyledSlide>
      <Form form={form} onValuesChange={onChange}>
        <Form.Item name="title">
          <TitleInput placeholder="Title question" autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="questionType"
          label="Question Type"
          rules={[{ required: true }]}
        >
          <Select
            defaultActiveFirstOption
            style={{ width: 120 }}
            // onChange={handleChange}
          >
            <Option value="QUESTION_CHOICE_ANSWER">Quiz</Option>
            <Option value="QUESTION_TRUE_FALSE">True or False</Option>
            <Option value="QUESTION_INPUT_ANSWER" disabled>
              Input answer
            </Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="score"
          label="Score"
          initialValue={1000}
          rules={[{ type: "number", required: false }]}
        >
          <Slider marks={score} min={0} max={2000} step={null} />
        </Form.Item>
        <Form.Item
          name="seconds"
          label="Time"
          rules={[{ type: "number", required: false }]}
        >
          <Select placeholder="Choose a time" style={{ width: 150 }}>
            <Option value={5}>5 seconds</Option>
            <Option value={10}>10 seconds</Option>
            <Option value={20}>20 seconds</Option>
            <Option value={30}>30 seconds</Option>
            <Option value={60}>1 minute</Option>
            <Option value={90}>1 minute 30 seconds</Option>
            <Option value={120}>2 minutes</Option>
            <Option value={240}>4 minutes</Option>
          </Select>
        </Form.Item>

        <Form.List name="answers" initialValue={["", "", "", ""]}>
          {(answers, { add, remove }) => {
            return (
              <div>
                {answers.map((answer, index) => (
                  <div key={answer.key}>
                    <Form.Item label={`Option ${index + 1}`}>
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={12}>
                          <Form.Item
                            name={[index, "text"]}
                            rules={[{ require: true }]}
                          >
                            <Input
                              placeholder={`Option ${index + 1}`}
                              autoComplete="off"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            name={[index, "correct"]}
                            valuePropName="checked"
                            rules={[{ require: true, type: "boolean" }]}
                          >
                            <Checkbox checked={false} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                  </div>
                ))}
              </div>
            );
          }}
        </Form.List>
      </Form>
    </StyledSlide>
  );
}

export default SingleSlideDetail;
