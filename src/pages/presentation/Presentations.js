import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Space,
  PageHeader,
} from "antd";
import React from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import AppSider from "../../common/AppSider";
import NotFound from "../../common/NotFound";
import { createPresentation } from "../../util/APIUtils";
import EditPresentation from "./EditPresentation";
import PresentationList from "./PresentationList";

const { TextArea } = Input;

const routes = [
  {
    path: "/",
    breadcrumbName: "Home",
  },
  {
    path: "/presentation",
    breadcrumbName: "Presentation List",
  },
];

notification.config({
  placement: "topRight",
  top: 70,
  duration: 2,
});

const Presentations = (props) => {
  let match = useRouteMatch();

  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();
  const history = useHistory();

  const showModal = () => {
    setVisible(true);
  };

  const handleSubmit = (values) => {
    const titlePresentation = Object.assign({}, values);

    setConfirmLoading(true);
    createPresentation(titlePresentation)
      .then((response) => {
        notification.success({
          message: "Viedu App",
          description: "Created new presentation!",
        });
        setTimeout(() => {
          history.push(`${match.url}/${response.id}`);
        }, 2000);
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

  return (
    <Switch>
      <Route
        exact
        path={match.path}
        render={() => (
          <AppSider>
            <PageHeader
              title="My presentations"
              breadcrumb={{ routes }}
              subTitle=""
            />
            <Row>
              <Col span={6}>
                <Space>
                  <Button type="primary" onClick={showModal}>
                    New Presentation
                  </Button>
                </Space>
              </Col>
              <Col span={18}></Col>
            </Row>
            <br />
            <Modal
              title="New presentation"
              visible={visible}
              onOk={form.submit}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
              okText="Create"
            >
              <Form form={form} onFinish={handleSubmit}>
                <Form.Item name="title" rules={[{ required: true }]}>
                  <TextArea
                    showCount
                    allowClear
                    autoSize={{ maxRows: 1 }}
                    maxLength={100}
                    placeholder="Presentation name"
                    onPressEnter={handleSubmit}
                  />
                </Form.Item>
              </Form>
            </Modal>
            <br />
            <PresentationList />
          </AppSider>
        )}
      />
      <Route
        path={`${match.path}/:presentationId/edit`}
        component={EditPresentation}
      />
      <Route
        path={`${match.path}/:presentationId`}
        component={EditPresentation}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Presentations;
