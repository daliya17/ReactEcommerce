import { Tooltip, withStyles } from '@material-ui/core';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ActionCreators from '../../actions/payers';
import ReduxTable from '../../components/table/ReduxTable';
import Strings from '../../constants/strings.json';
import Lib from '../../lib';
import Path from '../../lib/path';
import AddPayers from './addpayers';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state) {
  return {
    payers: state.payers,
    selectedPayerIndex: state.views.payers.selectedPayerIndex
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchPayers: ActionCreators.fetchPayers,
      updatePayerSelection: ActionCreators.updatePayerSelection
    },
    dispatch
  );
}

const styles = {
  listItem: {
    background: 'white'
  },
  promotedIcon: {
    color: '#0db90d',
    marginRight: '5px'
  }
};

class PayersList extends React.Component {
  static defaultProps = {};

  static propTypes = {
    updatePayerSelection: PropTypes.func.isRequired
  };

  handlePayerSelect = index => {
    if (index !== this.props.selectedPayerIndex) {
      this.props.updatePayerSelection(index);
      // Once the payer is selected set the path to selection payer
      const { payers } = this.props;
      const payerId = Lib.getPayerId(payers, index);
      Path.redirect(Path.getPayerPath(payerId));
    }
  };

  isInSidePane() {
    return Path.getSelectedPayer() > -1;
  }

  getColumnDefinitions() {
    let definitions = [
      {
        id: 'payerId',
        numeric: true,
        label: 'Payer Id',
        disablePadding: this.isInSidePane()
      },
      { id: 'payerName', label: 'Payer Name', filterable: true },
      {
        id: 'promoted',
        label: 'Promoted',
        render: this.renderPromotion,
        disablePadding: this.isInSidePane()
      }
    ];

    return definitions;
  }

  setScroller = node => {
    if (!this.node) {
      Lib.scrollIntoView(node, this.selectedRow);
    }
    this.scroller = node;
  };

  setSelectedRow = node => {
    if (!this.selectedRow) {
      Lib.scrollIntoView(this.scroller, node);
    }
    this.selectedRow = node;
  };

  renderPromotion = row => {
    let { classes } = this.props;

    const dateString = Lib.toDateString(row.promoted);
    // in the right pane, show the actual date
    if (!this.isInSidePane()) {
      return dateString;
    }
    // in the left pane, show the promoted symbol
    else if (row.promoted) {
      return (
        <Tooltip title={dateString}>
          <TrendingUpIcon className={classes.promotedIcon} />
        </Tooltip>
      );
    }
    return null;
  };

  render() {
    const { payers, selectedPayerIndex } = this.props;
    const selected = selectedPayerIndex >= 0 ? [selectedPayerIndex] : [];

    return (
      <div className="scrollable" ref={this.setScroller}>
        <ReduxTable
          name={Strings.payersTable}
          columns={this.getColumnDefinitions()}
          rows={payers}
          title={'Payers'}
          selected={selected}
          onSelect={this.handlePayerSelect}
          filterable={!this.isInSidePane()}
          addable={!this.isInSidePane()}
          addComponent={() => <AddPayers />}
          selectedRowRef={this.setSelectedRow}
          refreshable
          onRefresh={this.props.fetchPayers}
          highlightAlternateRow={!this.isInSidePane()}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PayersList));
