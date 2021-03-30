import {
  Divider,
  Form,
  Input,
  Layout,
  Button,
  Space,
  Slider,
  Select,
  Col,
  Row,
  Checkbox,
  notification,
  Switch,
  Card,
  Typography,
} from "antd";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./EditQuestion.css";
import score from "./../../util/score";
import { updateQuestion, getQuestion } from "./../../util/APIUtils";
import LoadingIndicator from "./../../common/LoadingIndicator";
import {
  CheckOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  SettingOutlined,
  SketchOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import * as QuestionType from "util/QuestionType";

const { Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

const TitleInput = styled(Input)`
  font-size: 3em;
  font-weight: bold;
  border: 2px solid dodgerblue;
  border-radius: 3px;

  margin: ${(props) => props.size};
  padding: ${(props) => props.size};
`;

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 24,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 24,
  },
};

const EditQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [question, setQuestion] = useState({});
  const { questionId } = useParams();
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const combineId = { ...values, id: questionId };

    const requestData = Object.assign({}, combineId);

    setSubmiting(true);
    setTimeout(() => {
      updateQuestion(requestData).then((response) => {
        notification.success({
          message: "Success",
          description: "Saved changes",
        });
        setSubmiting(false);
      });
    }, 2000);
  };

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    const onFill = (values) => {
      form.setFieldsValue(values);
    };
    setLoading(true);
    getQuestion(questionId)
      .then((response) => {
        // console.log(response);
        onFill(response);
        setQuestion(response);
        setLoading(false);
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: "Have error",
        });
        setLoading(false);
      });
  }, [questionId, form]);

  return loading ? (
    <LoadingIndicator />
  ) : (
    <Layout>
      {/* <Sider width={200} className="site-layout-background"></Sider> */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "24px 24px 24px",
        }}
      >
        <Card style={{ width: "60%" }}>
          <Row>
            <Col span={6}>
              <Button type="primary" onClick={() => window.history.back()}>
                Back
              </Button>
            </Col>
          </Row>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Form
              {...layout}
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
            >
              <Form.Item name="questionType" hidden>
                <Input placeholder="Question type" disabled />
              </Form.Item>
              <Form.Item name="createdAt" hidden>
                <Input placeholder="createdAt" disabled />
              </Form.Item>
              <Form.Item name="modifiedAt" hidden>
                <Input placeholder="modifiedAt" disabled />
              </Form.Item>
              <Form.Item
                name="title"
                label={<Title level={4}>Your question</Title>}
              >
                <TitleInput
                  placeholder="Enter your question"
                  autoComplete="off"
                />
              </Form.Item>

              <Divider />
              <Form.List name="answers" initialValue={["", ""]}>
                {(answers, { add, remove }) => {
                  return (
                    <div>
                      {question.questionType ===
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
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={2}>
                                    <Form.Item
                                      name={[index, "correct"]}
                                      valuePropName="checked"
                                      rules={[
                                        { require: true, type: "boolean" },
                                      ]}
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
                        : question.questionType ===
                          QuestionType.QUESTION_TRUE_FALSE
                        ? answers.map((answer, index) => (
                            <div key={answer.key}>
                              <Form.Item label={`Option ${index + 1}`}>
                                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                  <Col span={12}>
                                    <Form.Item
                                      name={[index, "text"]}
                                      rules={[{ require: true }]}
                                    >
                                      <Input readOnly />
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item
                                      name={[index, "correct"]}
                                      valuePropName="checked"
                                      rules={[
                                        { require: true, type: "boolean" },
                                      ]}
                                    >
                                      <input
                                        style={{ fontSize: 15 }}
                                        name="inpRadio"
                                        type="radio"
                                        checked={false}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
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
                        : question.questionType ===
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
                                        placeholder={`Correct answer ${
                                          index + 1
                                        }`}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={2}>
                                    <Form.Item
                                      name={[index, "correct"]}
                                      valuePropName="checked"
                                      rules={[
                                        { require: true, type: "boolean" },
                                      ]}
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
                      question.questionType !==
                        QuestionType.QUESTION_TRUE_FALSE ? (
                        <Form.Item>
                          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Button
                              type="dashed"
                              onClick={() =>
                                question.questionType ===
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

              <Divider />

              <Form.Item
                wrapperCol={{ span: 8 }}
                name="score"
                label={
                  <Title level={4}>
                    <SketchOutlined /> Points
                  </Title>
                }
                initialValue={0}
                rules={[{ type: "number", required: false }]}
              >
                <Slider marks={score} min={0} max={2000} step={null} />
              </Form.Item>

              <Form.Item
                wrapperCol={{ span: 5 }}
                name="seconds"
                label={
                  <Title level={4}>
                    <ClockCircleOutlined /> Time to answer
                  </Title>
                }
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

              {question.questionType === QuestionType.QUESTION_CHOICE_ANSWER ? (
                <Form.Item
                  wrapperCol={{ span: 5 }}
                  label={
                    <Title level={4}>
                      <SettingOutlined /> Question Option
                    </Title>
                  }
                  name="multiSelect"
                  rules={[{ require: false, type: "boolean" }]}
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
              ) : null}

              <Form.Item {...tailLayout}>
                <Space size="small">
                  <Button type="primary" loading={submiting} htmlType="submit">
                    Submit
                  </Button>
                  <Button htmlType="button" onClick={onReset}>
                    Reset
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Content>
        </Card>
      </div>
    </Layout>
  );
};

export default EditQuestion;
