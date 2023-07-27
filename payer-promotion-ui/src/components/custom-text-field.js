import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

class CustomTextField extends React.Component {
  static defaultProps = {};

  static propTypes = {
    ...TextField.propTypes,
    onBlur: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      value: newProps.value
    });
  }

  handleChange = event => {
    if (this.props.onChange) {
      this.props.onChange(event);
      return;
    }

    this.setState({
      value: event.target.value
    });
  };

  handleBlur = event => {
    if (this.props.value !== this.state.value) {
      if (this.props.onBlur) {
        this.props.onBlur(event);
      }
    }
  };

  render() {
    const InputProps = this.props.InputProps || {};
    return (
      <TextField
        {...this.props}
        value={
          this.state.value === null
            ? ''
            : this.state.value === undefined
              ? ''
              : this.state.value
        }
        onChange={this.handleChange}
        InputProps={{
          ...InputProps,
          onBlur: this.handleBlur
        }}
      />
    );
  }
}

export default CustomTextField;
