import React from "react";
import { Upload, Modal, message, Input, Button, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { BASE_URL } from "constants/index";

import { resoleImageURI } from "util/ImageURI";

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
  const isLt4M = file.size / 1024 / 1024 < 4;
  if (!isLt4M) {
    message.error("Image must smaller than 4MB!");
  }
  return isJpgOrPng && isLt4M;
}

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

    if (fileList.length >= 1) {
      if (fileList[0].xhr)
        this.setState({
          fileList,
          file,
          name: fileList[0].xhr.status === 200 ? fileList[0].xhr.response : "",
        });
    }
    this.props.onChange?.(this.state.name);
  };

  handleRemove = () => {
    this.props.onChange?.("");
  };

  componentDidMount() {
    this.setState({ name: this.props.value });
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({ name: this.props.value });
    }
  }

  removeImage = () => {
    this.setState({ fileList: [], name: "" });
    this.handleRemove();
  };

  render() {
    const {
      previewVisible,
      previewImage,
      fileList,
      previewTitle,
      name,
    } = this.state;

    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    return (
      <div key={this.props.value}>
        {fileList.length === 0 && name !== "" && name !== undefined ? (
          <div>
            <div>
              <Image
                alt="media"
                preview={false}
                style={{ margin: 20 }}
                src={resoleImageURI(name)}
              />
            </div>
            <div>
              <Button type="primary" danger onClick={() => this.removeImage()}>
                Remove Image
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Upload
              action={BASE_URL + "/upload"}
              listType="picture-card"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
              onRemove={this.handleRemove}
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
        )}
      </div>
    );
  }
}

export default PicturesWall;
