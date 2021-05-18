import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Space, Table, Modal, notification, message } from "antd";
import React, { useEffect, useState } from "react";
import {
  countPresentations,
  getAllPresentations,
  deletePresentation,
  deletePresentations,
} from "../../util/APIUtils";

var moment = require("moment");

function PresentationList(props) {
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
      title: "Questions",
      dataIndex: "numberOfQuestions",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      sorter: {
        compare: (a, b) => a.createdDate - b.createdDate,
        multiple: 2,
      },
      render: (date) => moment(date).fromNow(),
    },
    {
      title: "Modified",
      dataIndex: "modifiedAt",
      sorter: {
        compare: (a, b) => a.updatedDate - b.updatedDate,
        multiple: 1,
      },
      render: (date) => moment(date).fromNow(),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" href={`/play?quizId=${record.id}`}>
            Play
          </Button>
          <Button href={`/presentations/${record.id}/edit`}>Edit</Button>
          <Button danger onClick={() => confirm(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  function confirm(presentationId) {
    Modal.confirm({
      title: "Delete presentation",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to delete this presentation? This action can’t be undone.",
      okText: "Delete",
      cancelText: "Cancel",
      onOk() {
        deletePresentation(presentationId)
          .then((response) => {
            notification.success({
              message: "Deleted",
              description: "Deleted presentation",
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
    countPresentations().then((response) => {
      if (mounted) setPagination((p) => ({ ...p, total: response }));
    });
    setLoading(false);

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getAllPresentations(pagination.current, pagination.pageSize).then(
      (response) => {
        if (mounted) {
          setData(response);
          setLoading(false);
        }
      }
    );

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

    deletePresentations(selectedRowKeys)
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

export default PresentationList;
