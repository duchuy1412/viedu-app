import {
  BankOutlined,
  BlockOutlined,
  DeleteOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
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
  Dropdown,
} from "antd";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Animate from "react-smooth";

import {
  getPresentation,
  addToPresentation,
  deleteFromPresentation,
} from "util/APIUtils";

import SingleSlide from "./SingleSlide";
import { updateSlide } from "./slideSlice";
import SlideDetail from "./SlideDetail";
import "./EditPresentation.css";

import QuestionBankDrawer from "./QuestionBankDrawer";

const { Content, Sider } = Layout;
const { Option } = Select;
const { confirm } = Modal;

const StyledButton = styled(Button)`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em dodgerblue;
  border-radius: 3px;
`;

const StyledSider = styled(Sider)``;

const StyledTinyButton = styled(Button)`
  padding: 4px 4px;
  opacity: 0.3;
  &:hover {
    opacity: 1;
  }
`;

const EditPresentation = () => {
  const { presentationId } = useParams();
  const [questions, setQuestions] = useState({ list: [], activeId: "" });
  const [title, setTitle] = useState("");

  const [visible, setVisible] = useState(false); // visible for Modal Add question
  const [confirmLoading, setConfirmLoading] = useState(false); // for loading when call api to create new question

  const [form] = Form.useForm();
  const [questionType, setQuestionType] = useState({
    name: "",
    description: "",
  });

  const dispatch = useDispatch();
  const slide = useSelector((state) => state.slides);

  const questionBankDrawer = useRef(null);

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

    confirm({
      title: "Do you want to delete this question?",
      icon: <ExclamationCircleOutlined />,
      content: "You cannot undo once a question is deleted",
      onOk() {
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

        // dispatch(currentSlide(questions.list[indexPrev - 1]));
        setQuestions({
          list: newList,
          activeId: nextActiveId,
        });

        deleteFromPresentation(questionId, presentationId)
          .then((response) => {
            message.success("Deleted!");
          })
          .catch((error) => message.error("Error!"));
      },
      onCancel() {
        // console.log("Cancel");
      },
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
    let answersField;
    if (values.questionType === "QUESTION_TRUE_FALSE") {
      answersField = { answers: [{ text: "TRUE" }, { text: "FALSE" }] };
      values = { ...values, ...answersField };
    }

    if (values.questionType === "QUESTION_INPUT_ANSWER") {
      answersField = {
        answers: [
          { text: "", correct: true },
          { text: "", correct: true },
        ],
      };
      values = { ...values, ...answersField };
    }
    // console.log(values);

    const newQuestion = Object.assign({}, values);

    setConfirmLoading(true);
    addToPresentation([newQuestion], presentationId)
      .then((response) => {
        setQuestions((questions) => ({
          ...questions,
          list: [...questions.list, ...response],
          activeId: response ? response[0].id : questions.activeId,
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

  // handle when change Question Type
  function handleChange(value) {
    switch (value) {
      case "QUESTION_CHOICE_ANSWER":
        setQuestionType({
          name: value,
          description:
            "Gives players several answer alternatives to choose from ",
        });
        break;
      case "QUESTION_TRUE_FALSE":
        setQuestionType({
          name: value,
          description: "Let players decided if the statement is true or false",
        });
        break;
      case "QUESTION_INPUT_ANSWER":
        setQuestionType({
          name: value,
          description: "Let players input a answer",
        });
        break;

      default:
        setQuestionType({
          name: "QUESTION_CHOICE_ANSWER",
          description: "",
        });
        break;
    }
  }

  // handle when click menu Import
  function handleMenuClick(e) {
    // message.info("Click on menu item.");
    // console.log("click", e.key);
    switch (e.key) {
      case "1":
        // console.log("Choose from bank");
        questionBankDrawer.current.showDrawer();
        break;
      case "2":
        // console.log("clicked 2");
        alert("Coming Soon...");
        break;
      default:
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

            addToPresentation([firstQuestion], presentationId)
              .then((response) => {
                setQuestions((questions) => ({
                  ...questions,
                  list: [...questions.list, ...response],
                  activeId: response ? response[0].id : questions.activeId,
                }));
              })
              .catch((error) => console.log(error));
          }
        }
      })
      .catch((error) => message.error("Error loading presentation"));

    return () => (mounted = false);
  }, [presentationId]);

  function refreshQuestionList() {
    getPresentation(presentationId)
      .then((response) => {
        if (response.questionList.length > 0) {
          setTitle(response.title);
          setQuestions((questions) => ({
            ...questions,
            list: response.questionList,
            activeId:
              response.questionList[response.questionList.length - 1].id,
          }));
        }
      })
      .catch((error) => message.error("Error loading presentation"));
  }

  return (
    <Layout>
      <StyledSider className="sider-presentation" width={"15vw"}>
        <Row
          style={{ marginTop: 5, marginBottom: 5 }}
          justify="space-around"
          align="middle"
        >
          <Col offset={2} span={4}>
            <Button onClick={() => window.history.back()}>Back</Button>
          </Col>
          <Col>
            <StyledButton type="primary" onClick={saveChange}>
              Save
            </StyledButton>
          </Col>
        </Row>
        <Row justify="start" align="middle">
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
                height: "18vh",
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
                  justifyContent: "center",
                  padding: "0 5px",
                }}
              >
                <span>{index + 1}</span>
                <StyledTinyButton type="text">
                  <BlockOutlined />
                </StyledTinyButton>
                <StyledTinyButton
                  type="text"
                  onClick={() => deleteSlide(slide.id)}
                >
                  <DeleteOutlined />
                </StyledTinyButton>
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
            <StyledButton type="primary" onClick={showModal}>
              Add question
            </StyledButton>
          </Col>
          <Col>
            <Dropdown
              overlay={
                <Menu onClick={handleMenuClick}>
                  <Menu.Item key="1" icon={<BankOutlined />}>
                    Import your questions
                  </Menu.Item>
                  <Menu.Item key="2" icon={<FileExcelOutlined />}>
                    Import from a file
                  </Menu.Item>
                </Menu>
              }
            >
              <StyledButton>
                Import <DownOutlined />
              </StyledButton>
            </Dropdown>

            <QuestionBankDrawer
              ref={questionBankDrawer}
              presentationId={presentationId}
              refreshQuestions={refreshQuestionList}
            />
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
              <Option value="QUESTION_INPUT_ANSWER">Input answer</Option>
            </Select>
          </Form.Item>
        </Form>
        <p>{questionType.description}</p>
      </Modal>

      <Animate to="1" from="0" attributeName="opacity">
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
      </Animate>
    </Layout>
  );
};

export default EditPresentation;
