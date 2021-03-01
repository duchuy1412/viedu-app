import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Space, Table, Modal, notification } from "antd";
import React, { useEffect, useState } from "react";
import {
  countPresentations,
  getAllPresentations,
  deletePresentation,
} from "../../util/APIUtils";
import { formatDate } from "../../util/Helpers";

function PresentationList(props) {
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
      render: (date) => formatDate(date),
    },
    {
      title: "Modified",
      dataIndex: "modifiedAt",
      sorter: {
        compare: (a, b) => a.updatedDate - b.updatedDate,
        multiple: 1,
      },
      render: (date) => formatDate(date),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" href={`/presentations/${record.id}/edit`}>
            Edit
          </Button>
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
    setLoading(true);
    countPresentations().then((response) =>
      setPagination((p) => ({ ...p, total: response }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);

    getAllPresentations(pagination.current, pagination.pageSize).then(
      (response) => {
        setData(response);
        setLoading(false);
      }
    );
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

export default PresentationList;
