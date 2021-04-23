import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Col, message, Row } from "antd";
import { useParams } from "react-router-dom";
import { getGame } from "util/APIUtils";

ReportDetail.propTypes = {};

function ReportDetail(props) {
  const { gameId } = useParams();
  const [game, setGame] = useState({});

  useEffect(() => {
    let mounted = true;
    getGame(gameId)
      .then((response) => {
        if (mounted) {
          setGame(response);
        }
      })
      .catch((error) => message.error("Error loading report"));

    return () => (mounted = false);
  }, [gameId]);

  return (
    <div>
      <Row>
        <Col span={8}>
          <div>{game.gameType}</div>
          <div>{game.hostedBy}</div>
        </Col>
        <Col span={8}></Col>
        <Col span={8}></Col>
      </Row>
    </div>
  );
}

export default ReportDetail;
