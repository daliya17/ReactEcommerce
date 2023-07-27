import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  withStyles
} from '@material-ui/core';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ActionCreators from '../../actions/paymentbatches';
import Popup from '../../lib/popup';
import Lib from '../../lib';

const styles = {
  addPaymentBatchesButton: {
    margin: '10px'
  }
};

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  return {
    ...state,
    ...props
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addPaymentBatches: ActionCreators.addPaymentBatches
    },
    dispatch
  );
}

class AddPaymentBatch extends React.Component {
  static defaultProps = {};

  static propTypes = {
    payerId: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      value: ''
    };
  }

  handleAddPaymentBatch = () => {
    let uservalue = this.state.value;

    //remove whitespaces
    uservalue = uservalue.replace(/ /g, '');

    if (uservalue.includes(',') && uservalue.includes('\n')) {
      Popup.alert(
        'Paymentbatch list should either be comma or space seperated.'
      );
      this.setState({
        value: ''
      });
      return;
    }

    //parse the
    let batchParseResult = Lib.parsePaymentBatchList(uservalue);

    if (batchParseResult.invalidText) {
      Popup.alert('Invalid Input found: ' + batchParseResult.invalidText);
      return;
    }

    if (batchParseResult.batchList.length === 0) {
      Popup.alert('Invalid Input or None of the paymentbatch is valid');
      return;
    }

    //everthing is fine, proceed to close the dialog and POST the data
    this.setState({
      open: false,
      value: ''
    });
    this.props.addPaymentBatches(
      this.props.payerId,
      batchParseResult.batchList
    );
  };

  handleAddClick = () => {
    this.setState({
      open: true
    });
  };

  handleValueChange = event => {
    this.setState({ value: event.target.value });
  };

  handleCancel = () => {
    this.setState({
      open: false,
      value: ''
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Button
          variant="contained"
          color="secondary"
          className={classNames(classes.addPaymentBatchesButton)}
          onClick={this.handleAddClick}
        >
          {'Add Payment Batches'}
        </Button>

        <Dialog
          open={this.state.open}
          aria-labelledby="add-paymentbatch-dialog"
        >
          <DialogTitle id="add-paymentbatch-dialog">
            Add PaymentBatches
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Provide the list of paymentbatchs, one batch in a line, in format
              9753A1926
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Payment Batch List"
              multiline={true}
              type="text"
              value={this.state.value}
              onChange={this.handleValueChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleAddPaymentBatch} color="primary">
              Add
            </Button>
            <Button onClick={this.handleCancel} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddPaymentBatch));
