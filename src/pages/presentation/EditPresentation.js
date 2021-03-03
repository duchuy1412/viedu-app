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
  message,
  Typography,
} from "antd";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import { getPresentation, addToPresentation } from "./../../util/APIUtils";

import SingleSlide from "./SingleSlide";
import { updateSlide, deleteOneSlide, currentSlide } from "./slideSlice";
import SlideDetail from "./SlideDetail";
import "./EditPresentation.css";
import { useSelector } from "react-redux";

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

const StyledSider = styled(Sider)``;

const EditPresentation = () => {
  const { presentationId } = useParams();
  const [questions, setQuestions] = useState({ list: [], activeId: "" });
  const [title, setTitle] = useState("");

  const [visible, setVisible] = useState(false); // visible for Modal Add question
  const [confirmLoading, setConfirmLoading] = useState(false); // for loading when call api to create new question

  const [form] = Form.useForm();
  const [description, setDescription] = useState(""); // description for type of question

  const dispatch = useDispatch();
  const slide = useSelector((state) => state.slides);

  //When click a Slide in Sidebar
  const onMenuItemClick = (clickItem) => {
    const { key } = clickItem;

    saveChange();

    setQuestions({ ...questions, activeId: key });
  };

  function deleteSlide(questionId) {
    // console.log("deleted: " + questionId);
    let { length } = questions.list;
    if (length <= 1) {
      message.warn("Presentation must have at least 1 question");
      return;
    }

    dispatch(deleteOneSlide({ slideId: questionId, id: presentationId })).then(
      () => {
        console.log("bla");
      }
    );

    let indexDelete; // indexDelete = index + 1 to avoid indexDelete equals 0 cause error
    questions.list.find((e, index) =>
      e.id === questions.activeId
        ? (indexDelete = index + 1)
        : (indexDelete = undefined)
    );

    --indexDelete; // to make "indexDelete" is index of its in array

    let nextActiveId;
    if (indexDelete === length - 1) {
      //deleting last element
      nextActiveId = questions.list[indexDelete - 1].id;
    } else {
      nextActiveId = questions.list[indexDelete + 1].id;
    }

    //duplicate list and delete a element from array
    let newList = questions.list;
    newList.splice(indexDelete, 1);

    console.log(nextActiveId);
    console.log(newList);

    // dispatch(currentSlide(questions.list[indexPrev - 1]));
    setQuestions({
      list: newList,
      activeId: nextActiveId,
    });
  }

  function saveChange() {
    let indexPrev;
    questions.list.find((e, index) =>
      e.id === questions.activeId
        ? (indexPrev = ++index)
        : (indexPrev = undefined)
    );

    questions.list[--indexPrev] = slide.current;

    dispatch(updateSlide({ slide: slide.current, id: presentationId }));
  }

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
    let mounted = true;
    getPresentation(presentationId)
      .then((response) => {
        if (response.questionList) {
          // case: Presentation has one or more questions => loading list of questions

          if (mounted && response.questionList.length > 0) {
            setTitle(response.title);
            setQuestions((questions) => ({
              ...questions,
              list: response.questionList,
              activeId: response.questionList[0].id,
            }));

            message.success("Completely loading!");
          }
        } else {
          // case: Presentation has no question => create a blank question choice answer
          if (mounted) {
            setTitle(response.title);

            const firstQuestion = {
              questionType: "QUESTION_CHOICE_ANSWER",
              title: "",
            };

            addToPresentation(firstQuestion, presentationId)
              .then((response) => {
                // console.log(response);

                setQuestions((questions) => ({
                  ...questions,
                  list: [...questions.list, response],
                  activeId: response.id,
                }));
              })
              .catch((error) => console.log(error));
          }
        }
      })
      .catch((error) => message.error("Error loading presentation"));

    return () => (mounted = false);
  }, [presentationId]);

  return (
    <Layout>
      <StyledSider width={"15vw"}>
        <Row
          style={{ marginTop: 5, marginBottom: 5 }}
          type="flex"
          justify="space-around"
          align="middle"
        >
          <Col offset={2} span={4}>
            <Button onClick={() => window.history.back()}>Back</Button>
          </Col>
          <Col>
            <StyledButton primary="true" onClick={saveChange}>
              Save
            </StyledButton>
          </Col>
        </Row>
        <Row type="flex" justify="start" align="middle">
          <Col offset={2} span={19}>
            <Typography.Title
              level={3}
              editable={{ onChange: setTitle }}
              ellipsis
            >
              {title}
            </Typography.Title>
          </Col>
        </Row>

        <Menu defaultActiveFirst onSelect={onMenuItemClick}>
          {questions.list.map((slide, index) => (
            <Menu.Item
              style={{
                padding: 5,
                height: "17vh",
                flex: 1,
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                alignItems: "stretch",
              }}
              key={slide.id}
            >
              <div
                style={{
                  width: "20%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "0 5px",
                }}
              >
                <span>{index + 1}</span>
              </div>
              <div
                style={{
                  width: "77%",
                }}
              >
                <SingleSlide
                  text={slide.title}
                  isActive={slide.id === questions.activeId}
                />
              </div>
            </Menu.Item>
          ))}
        </Menu>

        <Row type="flex" justify="space-around" align="middle">
          <Col>
            <StyledButton primary="true" onClick={showModal}>
              Add question
            </StyledButton>
          </Col>
        </Row>
      </StyledSider>

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
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          background: "whitesmoke",
        }}
      >
        {questions.list.length > 0 ? (
          <SlideDetail
            content={questions.list.find((e) => e.id === questions.activeId)}
            deleteSlide={deleteSlide}
          />
        ) : null}
      </Content>
    </Layout>
  );
};

export default EditPresentation;
