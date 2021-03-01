import React, { useState, useEffect } from "react";
import {
  Layout,
  Modal,
  Select,
  Row,
  Col,
  Button,
  Form,
  Menu,
  Space,
  Divider,
  message,
} from "antd";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { getPresentation, addToPresentation } from "./../../util/APIUtils";

import SingleSlide from "./SingleSlide";
import SingleSlideDetail from "./SingleSlideDetail";
import "./EditPresentation.css";

const { Content, Sider } = Layout;
const { Option } = Select;

const StyledButton = styled(Button)`
  background: ${(props) => (props.primary ? "dodgerblue" : "white")};
  color: ${(props) => (props.primary ? "white" : "dodgerblue")};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em dodgerblue;
  border-radius: 3px;
`;

const EditPresentation = () => {
  const { presentationId } = useParams();
  const [questions, setQuestions] = useState({ list: [], activeId: "" });

  const [visible, setVisible] = useState(false); // visible for Modal Add question
  const [confirmLoading, setConfirmLoading] = useState(false); // for loading when call api to create new question

  const [form] = Form.useForm();
  const [description, setDescription] = useState(""); // description for type of question

  //When click a Slide in Sidebar
  const onMenuItemClick = (clickItem) => {
    const { key } = clickItem;
    setQuestions({ ...questions, activeId: key });
  };

  //Show modal Add question
  const showModal = () => {
    setVisible(true);
  };

  // handle when Add new question
  const handleSubmit = (values) => {
    const typeOfQuestion = Object.assign({}, values);

    setConfirmLoading(true);
    addToPresentation(typeOfQuestion, presentationId)
      .then((response) => {
        setQuestions((questions) => ({
          ...questions,
          list: [...questions.list, response],
          activeId: response.id,
        }));
        message.success("New question");
      })
      .catch((error) => message.error("Error"));
    setVisible(false);
    setConfirmLoading(false);
  };

  // handle when click button Cancel
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  // handle when change type of question
  function handleChange(value) {
    switch (value) {
      case "QUESTION_CHOICE_ANSWER":
        setDescription(
          "Gives players several answer alternatives to choose from "
        );
        break;
      case "QUESTION_TRUE_FALSE":
        setDescription("Let players decided if the statement is true or false");
        break;
      case "QUESTION_INPUT_ANSWER":
        setDescription("Let players input a answer");
        break;

      default:
        setDescription("");
        break;
    }
  }

  useEffect(() => {
    getPresentation(presentationId)
      .then((response) => {
        if (response.questionList) {
          // case: Presentation has one or more questions => loading list of questions

          message.info("Please wait, loading!");

          if (response.questionList.length > 0) {
            setQuestions((questions) => ({
              ...questions,
              list: response.questionList,
              activeId: response.questionList[0].id,
            }));
          }

          message.success("Completely loading!");
        } else {
          // case: Presentation has no question => create a blank question choice answer

          const firstQuestion = {
            questionType: "QUESTION_CHOICE_ANSWER",
            title: "",
          };

          addToPresentation(firstQuestion, presentationId)
            .then((response) => {
              console.log(response);
              setQuestions((questions) => ({
                ...questions,
                list: [...questions.list, response],
                activeId: response.id,
              }));
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => message.error("Error loading presentation"));
  }, [presentationId]);

  return (
    <Layout>
      <Sider width={220} className="site-layout-background">
        <Row type="flex" justify="center" align="middle">
          <Col>
            <Space size="small">
              <Button onClick={() => window.history.back()}>Back</Button>
              <StyledButton primary="true" onClick={showModal}>
                Add question
              </StyledButton>
            </Space>
          </Col>
        </Row>
        <Modal
          title="New question"
          visible={visible}
          onOk={form.submit}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText="Create"
        >
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item
              name="questionType"
              label="Question Type"
              rules={[{ required: true }]}
            >
              <Select
                defaultActiveFirstOption
                style={{ width: 120 }}
                onChange={handleChange}
              >
                <Option value="QUESTION_CHOICE_ANSWER">Quiz</Option>
                <Option value="QUESTION_TRUE_FALSE">True or False</Option>
                <Option value="QUESTION_INPUT_ANSWER" disabled>
                  Input answer
                </Option>
              </Select>
            </Form.Item>
          </Form>
          <p>{description}</p>
        </Modal>
        <Divider />
        <Menu defaultActiveFirst onSelect={onMenuItemClick}>
          {questions.list.map((slide, index) => (
            <Menu.Item
              style={{
                padding: 10,
                height: 120,
                alignItems: "center",
                justifyContent: "center",
              }}
              key={slide.id}
            >
              <SingleSlide
                text={slide.title}
                isActive={slide.id === questions.activeId}
              />
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          height: "80vh",
          background: "whitesmoke",
        }}
      >
        {questions.list.length > 0 ? (
          <SingleSlideDetail
            content={questions.list.find((e) => e.id === questions.activeId)}
            presentation={presentationId}
          />
        ) : null}
      </Content>
    </Layout>
  );
};

export default EditPresentation;
