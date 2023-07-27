import { Button, withStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  addButton: {
    margin: '10px'
  }
};

const addable = (WrappedComponent, label) => {
  class AddableWrapper extends React.Component {
    state = {
      open: false
    };

    handleAddClick = () => {
      this.setState({
        open: true
      });
    };

    handleClose = () => {
      this.setState({
        open: false
      });
    };

    render() {
      const { classes, ...restProps } = this.props;

      return (
        <React.Fragment>
          <Button
            variant="contained"
            color="secondary"
            className={classes.addButton}
            onClick={this.handleAddClick}
          >
            {label}
          </Button>
          {this.state.open && (
            <WrappedComponent {...restProps} onClose={this.handleClose} />
          )}
        </React.Fragment>
      );
    }
  }

  AddableWrapper.propTypes = {
    classes: PropTypes.object.isRequired
  };

  return withStyles(styles)(AddableWrapper);
};

export default addable;
