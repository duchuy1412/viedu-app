import {
  Button,
  Col,
  Form,
  Modal,
  notification,
  Row,
  Select,
  Space,
  PageHeader,
  Input,
} from "antd";
import React from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";

import AppSider from "../../common/AppSider";
import { createQuestion } from "../../util/APIUtils";
import QuestionList from "./QuestionList";
import PrivateRoute from "./../../common/PrivateRoute";

const EditQuestion = React.lazy(() => import("./EditQuestion"));
const NotFound = React.lazy(() => import("common/NotFound"));

const { Option } = Select;
const { Search } = Input;

const routes = [
  {
    path: "/",
    breadcrumbName: "Home",
  },
  {
    path: "/questions",
    breadcrumbName: "Question List",
  },
];

const Questions = (props) => {
  let match = useRouteMatch();
  // console.log({ match });

  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const [form] = Form.useForm();
  const [description, setDescription] = React.useState("");
  const history = useHistory();

  const showModal = () => {
    setVisible(true);
  };

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

    const newQuestion = Object.assign({}, values);

    setConfirmLoading(true);
    createQuestion(newQuestion)
      .then((response) => {
        notification.success({
          message: "Viedu App",
          description: "Created new question!",
        });
        history.push(`${match.url}/${response.id}`);
      })
      .catch((error) => {
        notification.error({
          message: "Viedu App",
          description: error.message || "Error",
        });
      });
    setVisible(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  function handleChange(value) {
    // console.log(`selected ${value}`);
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

  const onSearch = () => {
    // alert("searching...");
  };

  return (
    <Switch>
      <Route
        exact
        path={match.path}
        render={() => (
          <AppSider>
            <PageHeader
              title="My questions"
              breadcrumb={{ routes }}
              subTitle=""
            />
            <Row
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Col span={6}>
                <Space>
                  <Button type="primary" onClick={showModal}>
                    New Question
                  </Button>
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
                          <Option value="QUESTION_TRUE_FALSE">
                            True or False
                          </Option>
                          <Option value="QUESTION_INPUT_ANSWER">
                            Input answer
                          </Option>
                        </Select>
                      </Form.Item>
                    </Form>
                    <p>{description}</p>
                  </Modal>
                </Space>
              </Col>
              <Col span={6}>
                <Search
                  placeholder="Search"
                  allowClear
                  enterButton
                  size="middle"
                  onSearch={onSearch}
                />
              </Col>
            </Row>
            <br />
            <QuestionList />
          </AppSider>
        )}
      />
      <Route
        authenticated
        path={`${match.path}/:questionId/edit`}
        component={EditQuestion}
      />
      <Route
        authenticated
        path={`${match.path}/:questionId`}
        component={EditQuestion}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Questions;
