import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import { createGame } from "util/APIUtils";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { currentGame } from "./../../hostSlice";

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

    history.push(`${match.url}/lobby?quizId=${quizId}`);
  }

  useEffect(() => {
    form.setFieldsValue({
      presentationId: quizId,
      gameType: "LIVE",
    });
  });

  return (
    <div>
      <div>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="gameType">
            <Input hidden />
          </Form.Item>
          <Form.Item name="presentationId">
            <Input hidden />
          </Form.Item>
          <Form.Item name="title">
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Create Room</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Main;
