import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Col,
  message,
  Row,
  Layout,
  PageHeader,
  Menu,
  Dropdown,
  Button,
  Tag,
  Tabs,
  Typography,
  List,
  Table,
  Card,
  Statistic,
  Progress,
} from "antd";
import { useParams } from "react-router-dom";
import { getGame } from "util/APIUtils";
import LoadingIndicator from "common/LoadingIndicator";
import {
  DeleteOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  LikeOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import "./style.css";

var moment = require("moment");

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

const columns = [
  {
    title: "Nickname",
    dataIndex: "nickname",
    sorter: {
      compare: (a, b) => a.nickname.localeCompare(b.nickname),
      multiple: 1,
    },
  },
  {
    title: "Rank",
    dataIndex: "rank",
    sorter: {
      compare: (a, b) => a.rank - b.rank,
      multiple: 2,
    },
  },
  {
    title: "Correct Answers",
    dataIndex: "correctAnswers",
    sorter: {
      compare: (a, b) => a.correctAnswers - b.correctAnswers,
      multiple: 3,
    },
  },
  {
    title: "Unanswered",
    dataIndex: "unanswered",
    sorter: {
      compare: (a, b) => a.unanswered - b.unanswered,
      multiple: 4,
    },
  },
  {
    title: "Points",
    dataIndex: "point",
    sorter: {
      compare: (a, b) => a.point - b.point,
      multiple: 5,
    },
  },
];

const menu = (
  <Menu>
    <Menu.Item>
      <Button type="text">
        <DownloadOutlined />
        Download report
      </Button>
    </Menu.Item>
    <Menu.Item>
      <Button type="text">
        <PrinterOutlined /> Print
      </Button>
    </Menu.Item>
    <Menu.Item>
      <Button type="text" danger>
        <DeleteOutlined /> Delete
      </Button>
    </Menu.Item>
  </Menu>
);

const DropdownMenu = () => (
  <Dropdown key="more" overlay={menu}>
    <Button
      style={{
        border: "none",
        padding: 0,
      }}
    >
      <EllipsisOutlined
        style={{
          fontSize: 20,
          verticalAlign: "top",
        }}
      />
    </Button>
  </Dropdown>
);

const routes = [
  {
    path: "/",
    breadcrumbName: "Home",
  },
  {
    path: "/reports",
    breadcrumbName: "Reports",
  },
];

const Content = ({ children, extraContent }) => (
  <Row>
    <div style={{ flex: 1, marginRight: 15 }}>{children}</div>
    <div className="image">{extraContent}</div>
  </Row>
);

ReportDetail.propTypes = {};

function ReportDetail(props) {
  const [loading, setLoading] = useState(false);
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

  let myTag;

  switch (game.gameStatus) {
    case "CREATED":
      myTag = <Tag color="blue">CREATED</Tag>;
      break;
    case "GOING_ON":
      myTag = <Tag color="gold">GOING ON</Tag>;
      break;
    case "FINISHED":
      myTag = <Tag color="green">FINISHED</Tag>;
      break;
    default:
      myTag = <Tag color="blue">CREATED</Tag>;
  }

  return loading ? (
    <LoadingIndicator />
  ) : (
    <Layout>
      <PageHeader
        onBack={() => window.history.back()}
        title={game.title ? game.title : "No title"}
        className="site-page-header"
        tags={myTag}
        extra={[
          <Button key="1" type="primary" href={`/play?quizId=${gameId}`}>
            Play again
          </Button>,
          <DropdownMenu key="more" />,
        ]}
        breadcrumb={{ routes }}
      >
        <Content
          extraContent={
            <List
              dataSource={[
                { label: "Type", content: game.gameType },
                {
                  label: "Started",
                  content: moment(game.createdAt).format(
                    "MMM D YYYY, h:mm:ss a"
                  ),
                },
                {
                  label: "Ended",
                  content: moment(game.modifiedAt).format(
                    "MMM D YYYY, h:mm:ss a"
                  ),
                },
                { label: "Hosted by", content: game.hostedBy },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text style={{ fontWeight: "bold" }}>
                    {item.label + ": "}
                  </Typography.Text>
                  {item.content}
                </List.Item>
              )}
            />
          }
        >
          <Card>
            <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab="Summary" key="1">
                <Row gutter={[16, 16]}>
                  <Col span={16}>
                    <Card>
                      <p>Number of players: {game.numberOfPlayers}</p>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card>
                      <Progress type="circle" percent={75} />
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Players" key="2">
                <Table
                  columns={columns}
                  dataSource={game.players}
                  loading={loading}
                />
              </TabPane>
              <TabPane tab="Questions" key="3">
                Diffrencult
              </TabPane>
              <TabPane tab="Feedback" key="4">
                <Statistic
                  title="Feedback"
                  value={1128}
                  prefix={<LikeOutlined />}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Content>
      </PageHeader>
    </Layout>
  );
}

export default ReportDetail;
