import { Button, Drawer, List, message } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import React, { useEffect, useState } from "react";
import {
  addToPresentation,
  countQuestions,
  getAllQuestions,
} from "util/APIUtils";

const { forwardRef, useImperativeHandle } = React;

const QuestionBankDrawer = forwardRef((props, ref) => {
  const { presentationId, refreshQuestions } = props;
  const [drawer, setDrawer] = useState({ visible: false, placement: "left" });
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [listSelected, setListSelected] = useState([]);
  const [importLoading, setImportLoading] = useState(false); // for loading when call import the question(s)

  useImperativeHandle(ref, () => ({
    showDrawer() {
      setDrawer((drawer) => ({
        ...drawer,
        visible: true,
      }));
    },
  }));

  const onClose = () => {
    setDrawer((drawer) => ({
      ...drawer,
      visible: false,
    }));
  };

  useEffect(() => {
    setLoading(true);
    countQuestions().then((response) =>
      setPagination((p) => ({ ...p, total: response }))
    );
    handleChangePage(1);
    setLoading(false);
  }, []);

  const handleChangePage = (page) => {
    setLoading(true);

    getAllQuestions(page, 2).then((response) => {
      setData(response);
      setLoading(false);
    });
  };

  const onCheckboxChange = (e, value) => {
    if (e.target.checked === true) {
      setListSelected((listSelected) => [...listSelected, value]);
    } else {
      setListSelected(listSelected.filter((item) => item.id !== value.id));
    }
  };

  const handleImport = () => {
    // console.log("Import button be clicked. list: ");
    // console.log(listSelected);
    setImportLoading(true);
    addToPresentation(listSelected, presentationId)
      .then((response) => {
        // refresh list selected
        setListSelected([]);

        // close Drawer
        onClose();

        // refresh
        refreshQuestions();

        message.success("Imported question(s)");
      })
      .catch((error) => message.error("Error when importing question"));
    setImportLoading(false);
  };

  return (
    <>
      <Drawer
        width={500}
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            Your question
            <Button
              type="primary"
              disabled={listSelected.length === 0 ? true : false}
              onClick={handleImport}
              loading={importLoading}
            >
              Import
            </Button>
          </div>
        }
        placement={drawer.placement}
        closable={false}
        onClose={() => onClose()}
        visible={drawer.visible}
        key={drawer.placement}
      >
        {listSelected.length > 0 ? (
          <div>You chose {listSelected.length} question(s) </div>
        ) : null}
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: handleChangePage,
            total: pagination.total,
            pageSize: 2,
          }}
          dataSource={data}
          loading={loading}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={
                  <Checkbox
                    checked={listSelected.some(
                      (checkItem) => checkItem.id === item.id
                    )}
                    onChange={(e) => onCheckboxChange(e, item)}
                  />
                }
                title={<a href={item.href}>{item.title}</a>}
                description={item.questionType}
              />
              {item.content}
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
});

export default QuestionBankDrawer;
