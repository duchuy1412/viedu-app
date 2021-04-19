import { LoadingOutlined } from "@ant-design/icons";
import React from "react";
import { Spin } from "antd";

export default function LoadingIndicator(props) {
  return (
    <Spin style={{ display: "block", textAlign: "center", marginTop: 30 }} />
  );
}
