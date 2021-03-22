import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Space, Table, Modal, notification } from "antd";
import React, { useEffect, useState } from "react";
import {
  countQuestions,
  getAllQuestions,
  deleteQuestion,
} from "../../util/APIUtils";

var moment = require("moment");

function QuestionList(props) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: {
        compare: (a, b) => a.title.localeCompare(b.title),
        multiple: 1,
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      sorter: {
        compare: (a, b) =>
          moment(b.createdAt).diff(moment(a.createdAt), "minutes", true),
        multiple: 2,
      },
      render: (date) => moment(date).fromNow(),
    },
    {
      title: "Modified",
      dataIndex: "modifiedAt",
      sorter: {
        compare: (a, b) =>
          moment(b.modifiedAt).diff(moment(a.modifiedAt), "minutes", true),
        multiple: 3,
      },
      render: (date) => moment(date).fromNow(),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" href={`/questions/${record.id}/edit`}>
            Edit
          </Button>
          <Button danger onClick={() => confirm(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  function confirm(questionId) {
    Modal.confirm({
      title: "Delete question",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to delete this question? This action can’t be undone.",
      okText: "Delete",
      cancelText: "Cancel",
      onOk() {
        // console.log("OK");
        deleteQuestion(questionId)
          .then((response) => {
            notification.success({
              message: "Deleted",
              description: "Deleted question",
            });
            //for refresh
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
    setLoading(true);
    countQuestions().then((response) =>
      setPagination((p) => ({ ...p, total: response }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);

    getAllQuestions(pagination.current, pagination.pageSize).then(
      (response) => {
        setData(response);
        setLoading(false);
      }
    );

    return () => {
      setData([]);
    };
  }, [pagination]);

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={pagination}
      onChange={handleTableChange}
    />
  );
}

export default QuestionList;
