import {
  CheckOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  SketchOutlined,
  PlusOutlined,
  SettingOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  Slider,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import score from "../../util/score";
import { currentSlide } from "./slideSlice";
import * as QuestionType from "util/QuestionType";
import PicturesWall from "pages/question/PicturesWall";

SlideDetail.propTypes = {};

const { Option } = Select;
const { Title } = Typography;

const StyledSlide = styled.div`
  background: white;
  color: dodgerblue;
  font-size: 1em;
  border: 1px solid gainsboro;
  padding: 50px;
  margin: 5px;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledSetting = styled.div`
  background: white;
  width: 20vw;
  color: dodgerblue;
  font-size: 1em;
  border: 1px solid gainsboro;
  padding: 50px;
  margin: 5px;
  display: flex;
  flex-direction: column;
`;

const TitleInput = styled(Input)`
  font-size: 3em;
  font-weight: bold;
  border: 2px solid dodgerblue;
  border-radius: 3px;

  margin: ${(props) => props.size};
  padding: ${(props) => props.size};
`;

// const OptionInput = styled(Input)`
//   color: dodgerblue;
//   font-size: 2em;
//   border: 2px solid dodgerblue;
//   border-radius: 3px;

//   margin: 5px;
//   padding: ${(props) => props.size};
// `;

function SlideDetail(props) {
  const { content } = props;

  const dispatch = useDispatch();

  const slide = useSelector((state) => state.slides);

  const [form] = Form.useForm();

  let formValues;

  function onChange(changedValues, allValues) {
    formValues = { ...slide.current, ...allValues };
    dispatch(currentSlide(formValues));
  }

  useEffect(() => {
    const onFill = (content) => {
      form.setFieldsValue({
        title: content.title,
        answers: content.answers
          ? content.answers
          : [{ text: "" }, { text: "" }],
        score: content.score,
        seconds: content.seconds,
        questionType: content.questionType,
        image: content.image ? content.image : "",
      });
    };

    onFill(content);
    dispatch(currentSlide(content));
  }, [content, form, dispatch]);

  return (
    <Form form={form} onValuesChange={onChange}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignContent: "space-between",
        }}
      >
        <StyledSlide>
          <Form.Item name="title">
            <TitleInput placeholder="Title question" autoComplete="off" />
          </Form.Item>

          <Form.Item
            name="image"
            label={
              <Title level={4}>
                <PictureOutlined /> Image
              </Title>
            }
          >
            <PicturesWall />
          </Form.Item>

          <Form.List name="answers" initialValue={["", ""]}>
            {(answers, { add, remove }) => {
              return (
                <div>
                  {slide.current.questionType ===
                  QuestionType.QUESTION_CHOICE_ANSWER
                    ? answers.map((answer, index) => (
                        <div key={answer.key}>
                          <Form.Item label={`Option ${index + 1}`}>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                              <Col span={18}>
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
                              <Col span={2}>
                                <Form.Item
                                  name={[index, "correct"]}
                                  valuePropName="checked"
                                  rules={[{ require: true, type: "boolean" }]}
                                >
                                  <Checkbox checked={false} />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                {index > 1 ? (
                                  <Button
                                    type="danger"
                                    onClick={() => remove(answer.name)}
                                  >
                                    Remove
                                  </Button>
                                ) : null}
                              </Col>
                            </Row>
                          </Form.Item>
                        </div>
                      ))
                    : slide.current.questionType ===
                      QuestionType.QUESTION_TRUE_FALSE
                    ? answers.map((answer, index) => (
                        <div key={answer.key}>
                          <Form.Item label={`Option ${index + 1}`}>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                              <Col span={6}>
                                <Form.Item
                                  name={[index, "text"]}
                                  rules={[{ require: true }]}
                                >
                                  <Input readOnly />
                                </Form.Item>
                              </Col>
                              <Col span={2}>
                                <Form.Item
                                  name={[index, "correct"]}
                                  valuePropName="checked"
                                  rules={[{ require: true, type: "boolean" }]}
                                >
                                  <input
                                    style={{ fontSize: 15 }}
                                    name="inpRadio"
                                    type="radio"
                                    checked={false}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form.Item>
                        </div>
                      ))
                    : slide.current.questionType ===
                      QuestionType.QUESTION_INPUT_ANSWER
                    ? answers.map((answer, index) => (
                        <div key={answer.key}>
                          <Form.Item label={`Correct answer ${index + 1}`}>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                              <Col span={18}>
                                <Form.Item
                                  name={[index, "text"]}
                                  rules={[{ require: true }]}
                                >
                                  <Input
                                    placeholder={`Correct answer ${index + 1}`}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={2}>
                                <Form.Item
                                  name={[index, "correct"]}
                                  valuePropName="checked"
                                  rules={[{ require: true, type: "boolean" }]}
                                >
                                  <Checkbox defaultChecked disabled />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                {index > 1 ? (
                                  <Button
                                    type="danger"
                                    onClick={() => remove(answer.name)}
                                  >
                                    Remove
                                  </Button>
                                ) : null}
                              </Col>
                            </Row>
                          </Form.Item>
                        </div>
                      ))
                    : "The type of question has not been determined"}
                  {answers.length < 4 &&
                  slide.current.questionType !==
                    QuestionType.QUESTION_TRUE_FALSE ? (
                    <Form.Item>
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Button
                          type="dashed"
                          onClick={() =>
                            slide.current.questionType ===
                            QuestionType.QUESTION_INPUT_ANSWER
                              ? add({ text: "", correct: true })
                              : add()
                          }
                          style={{ width: "60%" }}
                        >
                          <PlusOutlined /> Add more
                        </Button>
                      </Row>
                    </Form.Item>
                  ) : null}
                </div>
              );
            }}
          </Form.List>
        </StyledSlide>

        <StyledSetting>
          <Title level={4}>
            <CommentOutlined /> Question Type
          </Title>
          <Form.Item name="questionType" rules={[{ required: true }]}>
            <Select
              disabled
              // onChange={handleChange}
            >
              <Option value={QuestionType.QUESTION_CHOICE_ANSWER}>Quiz</Option>
              <Option value={QuestionType.QUESTION_TRUE_FALSE}>
                True or False
              </Option>
              <Option value={QuestionType.QUESTION_INPUT_ANSWER}>
                Input answer
              </Option>
            </Select>
          </Form.Item>
          <Title level={4}>
            <SketchOutlined /> Points
          </Title>
          <Form.Item
            name="score"
            initialValue={1000}
            rules={[{ type: "number", required: false }]}
          >
            <Slider marks={score} min={0} max={2000} step={null} />
          </Form.Item>
          <Title level={4}>
            <ClockCircleOutlined /> Time to answer
          </Title>
          <Form.Item
            name="seconds"
            rules={[{ type: "number", required: false }]}
          >
            <Select
              placeholder="Choose a time"
              menuItemSelectedIcon={<CheckOutlined />}
            >
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
          {slide.current.questionType ===
            QuestionType.QUESTION_CHOICE_ANSWER && (
            <>
              <Title level={4}>
                <SettingOutlined /> Question Option
              </Title>
              <Form.Item
                name="multiSelect"
                rules={[{ type: "boolean", required: false }]}
              >
                <Select
                  defaultActiveFirstOption
                  placeholder=""
                  menuItemSelectedIcon={<CheckOutlined />}
                >
                  <Option value={false}>Single select</Option>
                  <Option value={true}>Multi-select</Option>
                </Select>
              </Form.Item>
            </>
          )}
          <Button danger onClick={() => props.deleteSlide(slide.current.id)}>
            Delete
          </Button>
        </StyledSetting>
      </div>
    </Form>
  );
}

export default SlideDetail;
