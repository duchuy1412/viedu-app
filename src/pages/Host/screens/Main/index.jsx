import { Button, Divider, Form, Input, Switch, Row, Col, Collapse } from "antd";
import React, { useEffect } from "react";
import { createGame } from "util/APIUtils";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { currentGame } from "./../../hostSlice";

const { Panel } = Collapse;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Main(props) {
  const match = useRouteMatch();
  const [form] = Form.useForm();
  const history = useHistory();

  let query = useQuery();
  const quizId = query.get("quizId");

  const dispatch = useDispatch();

  async function handleSubmit(values) {
    const gameData = Object.assign({}, values);
    // console.log(log);

    await createGame(gameData)
      .then((response) => {
        dispatch(currentGame(response));
      })
      .catch((error) => console.log(error));

    history.push(`${match.url}/lobby?quizId=${quizId}`, {
      rootPath: match.url,
    });
  }

  useEffect(() => {
    form.setFieldsValue({
      presentationId: quizId,
      gameType: "LIVE",
    });
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Form
          style={{ width: 350, fontSize: 15 }}
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item name="gameType">
            <Input hidden />
          </Form.Item>
          <Form.Item name="presentationId">
            <Input hidden />
          </Form.Item>
          <Form.Item name="title">
            <Input autoFocus placeholder="Title" />
          </Form.Item>
          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button type="primary" htmlType="submit">
                Create Room
              </Button>
            </div>
          </Form.Item>

          <Collapse>
            <Panel header="Game options" key="1">
              <div>
                <Row>
                  <Col span={20}>
                    Show question and answers on player's device
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="playerDeviceDisplay"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={20}>Random order of questions</Col>
                  <Col span={4}>
                    <Form.Item name="randomQuestion" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={20}>Random order of answers</Col>
                  <Col span={4}>
                    <Form.Item name="randomAnswer" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={20}>Friendly nickname genarator</Col>
                  <Col span={4}>
                    <Form.Item name="nicknameGenerator" valuePropName="checked">
                      <Switch defaultChecked />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={20}>Show minimized intro instructions</Col>
                  <Col span={4}>
                    <Form.Item name="showInstructions" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Panel>
          </Collapse>
        </Form>
      </div>
    </>
  );
}

export default Main;
