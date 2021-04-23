import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Space, Table, Modal, notification, Tag } from "antd";
import {
  countGames,
  getAllGames,
  deleteGame,
  deleteGames,
} from "util/APIUtils";

var moment = require("moment");

ReportList.propTypes = {};

function ReportList(props) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const [operationloading, setOperationLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: {
        compare: (a, b) => a.title.localeCompare(b.title),
        multiple: 3,
      },
    },
    {
      title: "Status",
      dataIndex: "gameStatus",
      render: (status) => {
        switch (status) {
          case "CREATED":
            return <Tag color="blue">CREATED</Tag>;

          case "GOING_ON":
            return <Tag color="gold">GOING ON</Tag>;

          case "FINISHED":
            return <Tag color="green">FINISHED</Tag>;

          default:
            break;
        }
        return "";
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      sorter: {
        compare: (a, b) => a.createdAt - b.createdAt,
        multiple: 2,
      },
      render: (date) => moment(date).fromNow(),
    },
    {
      title: "Modified",
      dataIndex: "modifiedAt",
      sorter: {
        compare: (a, b) => a.modifiedAt - b.modifiedAt,
        multiple: 1,
      },
      render: (date) => moment(date).fromNow(),
    },
    {
      title: "Game mode",
      dataIndex: "gameType",
    },
    {
      title: "No. of players",
      dataIndex: "numberOfPlayers",
      sorter: {
        compare: (a, b) => a.numberOfPlayers - b.numberOfPlayers,
        multiple: 4,
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" href={`/play?quizId=${record.presentationId}`}>
            Play again
          </Button>
          <Button href={`/reports/${record.id}`}>Open</Button>
          <Button danger onClick={() => confirm(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  function confirm(gameId) {
    Modal.confirm({
      title: "Delete game",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to delete this game? This action can’t be undone.",
      okText: "Delete",
      cancelText: "Cancel",
      onOk() {
        deleteGame(gameId)
          .then((response) => {
            notification.success({
              message: "Deleted",
              description: "Deleted game",
            });
            setPagination({ ...pagination, total: pagination.total - 1 });
          })
          .catch((error) =>
            notification.error({
              message: "Error",
              description: "An error occurred",
            })
          );
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  }

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    countGames().then((response) => {
      if (mounted) setPagination((p) => ({ ...p, total: response }));
    });
    setLoading(false);

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getAllGames(pagination.current, pagination.pageSize).then((response) => {
      if (mounted) {
        setData(response);
        setLoading(false);
      }
    });

    return () => (mounted = false);
  }, [pagination]);

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      name: record.id,
    }),
  };

  const hasSelected = selectedRowKeys.length > 0;

  const deleteSelectedRows = () => {
    setOperationLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setOperationLoading(false);
    }, 1000);
  };

  return (
    <div>
      {hasSelected ? (
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            danger
            onClick={() => deleteSelectedRows()}
            loading={operationloading}
          >
            Delete
          </Button>
          <span style={{ marginLeft: 8 }}>
            {`Selected ${selectedRowKeys.length} items`}
          </span>
        </div>
      ) : null}
      <Table
        rowSelection={{ type: "checkbox", ...rowSelection }}
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
}

export default ReportList;
