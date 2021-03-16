import React from "react";
import PropTypes from "prop-types";
import { Input, Tooltip } from "antd";

InputPIN.propTypes = {};

function InputPIN(props) {
  const onChange = (e) => {
    const { value } = e.target;
    const reg = /^\d*(\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === "") {
      props.onChange(value);
    }
  };

  const onBlur = () => {
    const { onBlur } = props;
    if (onBlur) {
      onBlur();
    }
  };

  return <Input {...props} onChange={onChange} onBlur={onBlur} />;
}

export default InputPIN;
