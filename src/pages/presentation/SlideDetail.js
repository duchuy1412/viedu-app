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
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import score from "../../util/score";
import { currentSlide } from "./slideSlice";

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

const OptionInput = styled(Input)`
  color: dodgerblue;
  font-size: 2em;
  border: 2px solid dodgerblue;
  border-radius: 3px;

  margin: 5px;
  padding: ${(props) => props.size};
`;

function SlideDetail(props) {
  const { content } = props;

  const dispatch = useDispatch();

  const slide = useSelector((state) => state.slides);

  const [form] = Form.useForm();

  let formValues;

  function onChange(changedValues, allValues) {
    formValues = { ...slide.current, ...allValues };
    // console.log(formValues);
    dispatch(currentSlide(formValues));
  }

  useEffect(() => {
    dispatch(currentSlide(content));

    form.setFieldsValue({
      title: content.title,
      answers: content.answers
        ? content.answers
        : [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
      score: content.score,
      seconds: content.seconds,
      questionType: content.questionType,
    });
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
        </StyledSlide>

        <StyledSetting>
          <Title level={4}>Question Type</Title>
          <Form.Item name="questionType" rules={[{ required: true }]}>
            <Select
              defaultActiveFirstOption
              // onChange={handleChange}
            >
              <Option value="QUESTION_CHOICE_ANSWER">Quiz</Option>
              <Option value="QUESTION_TRUE_FALSE">True or False</Option>
              <Option value="QUESTION_INPUT_ANSWER" disabled>
                Input answer
              </Option>
            </Select>
          </Form.Item>
          <Title level={4}>Score</Title>
          <Form.Item
            name="score"
            initialValue={1000}
            rules={[{ type: "number", required: false }]}
          >
            <Slider marks={score} min={0} max={2000} step={null} />
          </Form.Item>
          <Title level={4}>Time to answer</Title>
          <Form.Item
            name="seconds"
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
          <Button danger onClick={() => props.deleteSlide(slide.current.id)}>
            Delete
          </Button>
        </StyledSetting>
      </div>
    </Form>
  );
}

export default SlideDetail;
