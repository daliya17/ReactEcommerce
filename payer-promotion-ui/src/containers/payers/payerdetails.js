import { Typography, Tooltip, withStyles } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ActionCreators from '../../actions/payers';
import {
  refreshPaymentBatchFiles,
  hidePaymentBatchFiles
} from '../../actions/paymentbatches';
import ReduxTable from '../../components/table/ReduxTable';
import Strings from '../../constants/strings.json';
import Lib from '../../lib';
import AddPaymentBatches from './addpaymentbatches';
import popup from '../../lib/popup';
import { displayDate } from '../../components/displayDate';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state) {
  const payers = state.payers;
  const payersView = state.views.payers;
  const selectedPayerIndex = payersView.selectedPayerIndex;
  const payerId = Lib.getPayerId(payers, selectedPayerIndex);
  const payerBatches = payersView.payerBatches[payerId] || [];
  return {
    payerId: Lib.getPayerId(payers, selectedPayerIndex),
    selectedPayer: state.payers[selectedPayerIndex] || {},
    payerBatches
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchPayerBatches: ActionCreators.fetchPayerBatches,
      refreshPaymentBatchFiles,
      hidePaymentBatchFiles
    },
    dispatch
  );
}

const styles = {
  tabs: {
    marginTop: '10px',
    borderTop: '1px solid #e8e8e8',
    borderBottom: '1px solid #e8e8e8',
    background: '#f8f8f8'
  }
};

class PayerDetails extends React.Component {
  static defaultProps = {};

  static propTypes = {};

  componentDidMount() {
    if (this.props.payerId > 0 && this.props.payerBatches.length === 0) {
      this.props.fetchPayerBatches(this.props.payerId);
    }
  }

  componentDidUpdate(prevProps) {
    const { payerId, payerBatches } = this.props;
    if (
      payerId > 0 &&
      prevProps.payerId !== payerId &&
      payerBatches.length === 0
    ) {
      this.props.fetchPayerBatches(this.props.payerId);
    }
  }

  setScroller = node => {
    if (!this.node) {
      Lib.scrollIntoView(node, this.selectedRow);
    }
    this.scroller = node;
  };

  getColumnDefinitions() {
    return [
      { id: 'id', numeric: true, label: 'id', width: '10%' },
      {
        id: 'batchId',
        numeric: true,
        label: 'Batch Id',
        width: '20%',
        filterable: true
      },
      {
        id: 'contextId',
        numeric: true,
        label: 'Context id',
        width: '20%',
        filterable: true
      },
      {
        id: 'remitType',
        label: 'Remit Type',
        width: '20%',
        filterable: true
      },
      {
        id: 'created',
        label: 'Added',
        width: '25%',
        render: row => displayDate(row.created)
      },
      { id: 'createdBy', label: 'Added By', width: '25%', filterable: true },
      {
        id: 'status',
        label: '',
        render: this.renderHasErrors,
        width: '30px'
      }
    ];
  }

  getActions() {
    if (!this.actions) {
      this.actions = [
        {
          id: 'refreshfiles',
          label: 'Refresh Files',
          selectionType: 'multiple',
          handler: this.handleFilesRefresh
        },
        {
          id: 'hidefiles',
          label: 'Hide Batches',
          selectionType: 'multiple',
          handler: this.handleHideFiles
        }
      ];
    }

    return this.actions;
  }

  handleFilesRefresh = indexes => {
    const { payerBatches } = this.props;
    const postData = indexes.map(index => {
      const batch = payerBatches[index];
      return {
        batchId: batch.batchId,
        contextId: batch.contextId
      };
    });
    this.props.refreshPaymentBatchFiles(postData, () => {
      popup.alert(
        'Files refresh for the selected payment batches is under process'
      );
    });
  };

  handleHideFiles = indexes => {
    const { payerId, payerBatches } = this.props;
    const postData = indexes.map(index => {
      const batch = payerBatches[index];
      return {
        batchId: batch.batchId,
        contextId: batch.contextId
      };
    });
    this.props.hidePaymentBatchFiles(payerId, postData);
  };

  renderHasErrors(row) {
    return (
      'imageLocation' in row &&
      'abpLocation' in row &&
      'meraLocation' in row &&
      ((!row.abpLocation && !row.meraLocation) || !row.imageLocation) && (
        <Tooltip title="There is an error with this payment batch. This payment batch will be skipped during regression">
          <ErrorIcon color="error" />
        </Tooltip>
      )
    );
  }

  render() {
    const { selectedPayer, payerBatches, payerId } = this.props;

    if (!payerId) {
      return (
        <React.Fragment>
          <Typography className="margin" variant="body1">
            {'Payer not found'}
          </Typography>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Typography className="headline" variant="headline">
          {selectedPayer.payerName + "'s Payment Batches"}
        </Typography>
        <div className="tabcontainer scrollable" ref={this.setScroller}>
          <ReduxTable
            name={Strings.payerBatchesTable}
            filterable
            actions={this.getActions()}
            columns={this.getColumnDefinitions()}
            rows={payerBatches}
            addable
            addComponent={() => (
              <AddPaymentBatches payerId={this.props.payerId} />
            )}
            refreshable
            onRefresh={() => this.props.fetchPayerBatches(payerId)}
            highlightAlternateRow
          />
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PayerDetails));
