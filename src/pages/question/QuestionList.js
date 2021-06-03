import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Space,
  Table,
  Modal,
  notification,
  message,
  Image,
} from "antd";
import React, { useEffect, useState } from "react";
import { resoleImageURI } from "util/ImageURI";
import { getQuestionType } from "util/QuestionType";
import {
  countQuestions,
  getAllQuestions,
  deleteQuestion,
  deleteQuestions,
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

  const [operationloading, setOperationLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
      title: "Image",
      dataIndex: "image",
      render: (text, record) => {
        return text ? (
          <Image preview={false} alt="media" src={resoleImageURI(text)} />
        ) : (
          "No image"
        );
      },
    },
    {
      title: "Question type",
      dataIndex: "questionType",
      render: (text, record) => {
        return getQuestionType(record);
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

    deleteQuestions(selectedRowKeys)
      .then((reponse) => {
        message.success("Deleted!");
        setPagination({
          ...pagination,
          total: pagination.total - selectedRowKeys.length,
        });
        setSelectedRowKeys([]);
      })
      .catch((error) => message.error("Error"));

    setOperationLoading(false);
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

export default QuestionList;
