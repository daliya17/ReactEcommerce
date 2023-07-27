import React from 'react';
import { isFunction } from 'lodash';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Select,
  MenuItem,
  withStyles
} from '@material-ui/core';

const styles = {
  newline: {
    display: 'block'
  },
  margin: {
    margin: '10px'
  }
};

class Alerts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmations: []
    };
  }

  componentDidMount() {
    window.addEventListener('display-alert', this.displayAlert);
    window.addEventListener('display-choose', this.displayChoose);
    window.addEventListener('display-confirm', this.displayConfirm);
  }

  componentWillUnmount() {
    window.removeEventListener('display-alert', this.displayAlert);
    window.removeEventListener('display-choose', this.displayChoose);
    window.removeEventListener('display-confirm', this.displayConfirm);
  }

  /**
   * Display a choose dialog
   */
  displayChoose = event => {
    const eventDetail = event.detail || {};
    if (isFunction(eventDetail.acknowledge)) eventDetail.acknowledge();

    this.setState(previousState => {
      return {
        confirmations: [
          ...previousState.confirmations,
          {
            type: 'choose',
            message: eventDetail.message,
            callback: eventDetail.onChoose,
            options: eventDetail.options
          }
        ]
      };
    });
  };

  /**
   * Display the alert message
   * @param {object} event
   */
  displayAlert = event => {
    const message = (event.detail || {}).message;
    if (isFunction(event.detail.acknowledge)) event.detail.acknowledge();

    this.setState(previousState => {
      return {
        confirmations: [
          ...previousState.confirmations,
          {
            type: 'alert',
            message
          }
        ]
      };
    });
  };

  /**
   * Display a confirm message
   */
  displayConfirm = event => {
    const eventDetail = event.detail || {};
    if (isFunction(eventDetail.acknowledge)) eventDetail.acknowledge();

    this.setState(previousState => {
      return {
        confirmations: [
          ...previousState.confirmations,
          {
            type: 'confirm',
            message: eventDetail.message,
            callback: eventDetail.onConfirm
          }
        ]
      };
    });
  };

  handleClose = () => {
    this.setState(previousState => {
      return {
        confirmations: [...previousState.confirmations.slice(1)]
      };
    });
  };

  handleChoose = option => {
    let value = option ? option.value : '';
    if (!value) return;

    const confirmation = this.state.confirmations[0];
    this.handleClose();
    confirmation.callback(value);
  };

  handleConfirm = value => {
    const confirmation = this.state.confirmations[0];
    this.handleClose();
    confirmation.callback(value);
  };

  renderSelect(options) {
    return (
      <div>
        <Select autoFocus onChange={this.handleChoose}>
          {options.map(option => (
            <MenuItem value={option.value}>{option.label}</MenuItem>
          ))}
        </Select>
      </div>
    );
  }

  renderActions(type) {
    const { classes } = this.props;

    if (type === 'confirm') {
      return (
        <React.Fragment>
          <Button
            onClick={() => this.handleConfirm(true)}
            variant="contained"
            color="secondary"
            className={classes.margin}
            autoFocus
          >
            {'Yes'}
          </Button>
          <Button
            onClick={() => this.handleConfirm(false)}
            variant="contained"
            color="secondary"
            className={classes.margin}
            autoFocus
          >
            {'No'}
          </Button>
        </React.Fragment>
      );
    }

    return (
      <Button
        onClick={this.handleClose}
        variant="contained"
        color="secondary"
        autoFocus
      >
        {type === 'alert' ? 'Ok' : 'Cancel'}
      </Button>
    );
  }

  render() {
    const { classes } = this.props;
    const confirmation = this.state.confirmations[0];
    const titles = {
      alert: 'Alert',
      choose: 'Choose',
      confirm: 'Confirm'
    };

    return confirmation ? (
      <Dialog
        open={this.state.confirmations.length > 0}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          {titles[confirmation.type]}
        </DialogTitle>
        <DialogContent id="alert-dialog-description">
          <DialogContentText>
            {confirmation.message.split('\n').map(text => (
              <span key={text} className={classes.newline}>
                {text}
              </span>
            ))}
          </DialogContentText>
          {confirmation.type === 'choose' &&
            confirmation.options &&
            this.renderSelect(confirmation.options)}
        </DialogContent>
        <DialogActions>{this.renderActions(confirmation.type)}</DialogActions>
      </Dialog>
    ) : null;
  }
}

export default withStyles(styles)(Alerts);
