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
  Radio,
} from "antd";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./EditQuestion.css";
import score from "./../../util/score";
import { updateQuestion, getQuestion } from "./../../util/APIUtils";
import LoadingIndicator from "./../../common/LoadingIndicator";
import { PlusOutlined } from "@ant-design/icons";

const { Content, Sider } = Layout;
const { Option } = Select;

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 8,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 16,
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
      <Sider width={200} className="site-layout-background"></Sider>
      <Layout style={{ padding: "24px 24px 24px" }}>
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
          <Form {...layout} form={form} onFinish={handleSubmit}>
            <Form.Item name="title" label="Title">
              <Input placeholder="Question title" />
            </Form.Item>

            <Divider />
            <Form.List name="answers" initialValue={["", ""]}>
              {(answers, { add, remove }) => {
                return (
                  <div>
                    {question.questionType === "QUESTION_CHOICE_ANSWER" ? (
                      answers.map((answer, index) => (
                        <div key={answer.key}>
                          <Form.Item label={`Option ${index + 1}`}>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                              <Col span={12}>
                                <Form.Item
                                  name={[index, "text"]}
                                  rules={[{ require: true }]}
                                >
                                  <Input placeholder={`Option ${index + 1}`} />
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
                    ) : question.questionType === "QUESTION_TRUE_FALSE" ? (
                      answers.map((answer, index) => (
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
                                  rules={[{ require: true, type: "boolean" }]}
                                >
                                  <Radio.Group>
                                    <Radio checked={false} />
                                  </Radio.Group>
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
                    ) : question.questionType === "QUESTION_INPUT_ANSWER" ? (
                      <></>
                    ) : (
                      "The type of question has not been determined"
                    )}
                    {answers.length < 4 &&
                    question.questionType !== "QUESTION_TRUE_FALSE" ? (
                      <Form.Item>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Button
                            type="dashed"
                            onClick={() => add()}
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
      </Layout>
    </Layout>
  );
};

export default EditQuestion;
