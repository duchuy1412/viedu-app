import React from "react";
import { Upload, Modal, message, Form, Input, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { BASE_URL } from "constants/index";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error("Image must smaller than 5MB!");
  }
  return isJpgOrPng && isLt5M;
}

const UploadItem = ({ originNode, file, fileList }) => {
  const errorNode = (
    <Tooltip title="Upload Error">{originNode.props.children}</Tooltip>
  );
  return <>{file.status === "error" ? errorNode : originNode}</>;
};

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    name: "",
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  handleChange = (stateChange) => {
    console.log(stateChange);
    const { fileList, file } = stateChange;
    this.setState({
      fileList,
      file,
      name: fileList.length >= 1 ? fileList[0].name : "",
    });

    this.props.onChange?.(this.state.name);
  };

  triggerChange = (changedValue) => {
    console.log("Im in triggerChange. ChangedValue: " + changedValue);
    this.props.onChange?.(changedValue);
  };

  onNameChange = (e) => {
    const newname = e.target.value;
    console.log("Im in onNameChange");

    this.triggerChange(newname);
  };

  render() {
    const {
      previewVisible,
      previewImage,
      fileList,
      previewTitle,
      name,
    } = this.state;
    const { value } = this.props;

    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    const nameFile = value || name;
    return (
      <>
        <Input value={nameFile} hidden />
        {/* {nameFile !== "" ? (
          <img
            alt="media"
            style={{ height: 250, margin: 20 }}
            src={BASE_URL + "/downloadFile/" + nameFile}
          />
        ) : ( */}
        <>
          <Upload
            action={BASE_URL + "/uploadFile"}
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            itemRender={(originNode, file, fileList) => originNode}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="preview" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </>
        {/* )} */}
      </>
    );
  }
}

export default PicturesWall;
