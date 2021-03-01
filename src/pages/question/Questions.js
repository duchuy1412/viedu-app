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
} from "antd";
import React from "react";
import {
  Route,
  Switch,
  useHistory,
  useRouteMatch,
  withRouter,
} from "react-router-dom";
import AppSider from "../../common/AppSider";
import NotFound from "../../common/NotFound";
import { createQuestion } from "../../util/APIUtils";
import EditQuestion from "./EditQuestion";
import QuestionList from "./QuestionList";
import PrivateRoute from "./../../common/PrivateRoute";

const { Option } = Select;

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
    const titleQuestion = Object.assign({}, values);

    setConfirmLoading(true);
    createQuestion(titleQuestion)
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
            <Row>
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
                          <Option value="QUESTION_INPUT_ANSWER" disabled>
                            Input answer
                          </Option>
                        </Select>
                      </Form.Item>
                    </Form>
                    <p>{description}</p>
                  </Modal>
                </Space>
              </Col>
              <Col span={18}></Col>
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
