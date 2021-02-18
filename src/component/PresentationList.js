import React, { useState, useEffect } from "react";
import { Table, Space, Button } from "antd";
import { formatDate } from "./../util/Helpers";

import { getAllPresentations } from "./../util/APIUtils";

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
        <Button type="primary">Edit</Button>
        <Button danger>Delete</Button>
      </Space>
    ),
  },
];

function PresentationList(props) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 20,
  });
  const [loading, setLoading] = useState(false);

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
