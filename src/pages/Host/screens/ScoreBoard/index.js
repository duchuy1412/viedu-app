import React from "react";
import PropTypes from "prop-types";
import { List, Typography } from "antd";

ScoreBoard.propTypes = {
  list: PropTypes.array.isRequired,
};

function ScoreBoard(props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography.Title level={1}>Score Board</Typography.Title>
      <List
        size="large"
        style={{ width: "50%", margin: 20 }}
        itemLayout="horizontal"
        dataSource={props.list}
        renderItem={(item) => (
          <List.Item actions={[<span key={item.id}>{item.point}</span>]}>
            <List.Item.Meta
              title={<a href={`#${item.nickname}`}>{item.nickname}</a>}
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default ScoreBoard;
