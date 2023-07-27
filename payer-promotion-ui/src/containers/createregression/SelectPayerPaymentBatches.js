import { CircularProgress, Typography, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchPayerBatches } from '../../actions/payers';
import MultiSelect from '../../components/multiselect';
import Selector from '../../lib/selectors';
import * as ActionCreators from '../../actions/createregression';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  return {
    ...Selector.createRegressionSelectPayerPaymentBatches(state)
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchPayerBatches,
      handlePayerBatchesMultiSelect:
        ActionCreators.handlePayerBatchesMultiSelect,
      handlePayerBatchesMultiClear: ActionCreators.handlePayerBatchesMultiClear,
      handlePayerBatchesToggle: ActionCreators.handlePayerBatchesToggle
    },
    dispatch
  );
}

const styles = {
  // overridden by parent class
  heading: {},
  // overridden by parent class
  multiSelect: {},
  loader: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  hint: {
    marginTop: '10px'
  }
};

class SelectPayerPaymentBatches extends React.Component {
  componentDidUpdate() {
    if (!this.props.payerBatches && this.props.payerId > 0) {
      this.props.fetchPayerBatches(this.props.payerId);
    }
  }

  render() {
    const {
      classes,
      selectedPayerIndex,
      payerBatches,
      payerName,
      selectedBatches
    } = this.props;
    if (selectedPayerIndex < 0) return null;

    return (
      <React.Fragment>
        <Typography variant="subheading" className={classes.heading}>
          {'Select payment batches for payer: ' + payerName}
        </Typography>
        {!payerBatches && (
          <div className={classes.loader}>
            <CircularProgress color="secondary" size={50} />
            <Typography className={classes.hint} variant="caption">
              {'Loading payment batches'}
            </Typography>
          </div>
        )}
        {payerBatches && (
          <MultiSelect
            canToggleMultiple
            className={classes.multiSelect}
            options={payerBatches}
            selectedValues={selectedBatches}
            onMultiSelect={this.props.handlePayerBatchesMultiSelect}
            onMultiClear={this.props.handlePayerBatchesMultiClear}
            onToggle={this.props.handlePayerBatchesToggle}
          />
        )}
      </React.Fragment>
    );
  }
}

SelectPayerPaymentBatches.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedPayerIndex: PropTypes.number.isRequired,
  payerId: PropTypes.number.isRequired,
  payerBatches: PropTypes.array,
  selectedBatches: PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SelectPayerPaymentBatches));
