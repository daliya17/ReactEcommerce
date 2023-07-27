import { Typography, withStyles, IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import ReduxTable from '../../../components/table/ReduxTable';
import Strings from '../../../constants/strings.json';
import DiffCategoriesLibrary from '../../../lib/DiffCategoriesLibrary';
import classNames from 'classnames';
import Lib from '../../../lib';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import { Link } from 'react-router-dom';
import Path from '../../../lib/path';

const styles = {
  info: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: '15px 0px 0px 15px',

    '&.small': {
      flexDirection: 'column',
      alignItems: 'flex-start'
    },

    '& span': {
      color: '#555',
      marginLeft: '10px'
    }
  },
  unfoldIconButton: {
    position: 'absolute',
    right: 0
  },
  unfoldIcon: {
    transform: 'rotate(-90deg)'
  },
  link: {
    color: 'inherit',
    position: 'absolute',
    right: 0,
    margin: '0px 15px'
  },
  infoHolder: {
    position: 'relative'
  }
};

class RegressionDiffsTable extends React.Component {
  node;
  selectedRow;

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

  getColumnDefinitions() {
    const { isInLeftPane } = this.props;

    let definitions = [
      {
        id: 'batch',
        filterable: true,
        label: 'Payment Batch'
      }
    ];

    if (!isInLeftPane) {
      definitions = [
        ...definitions,
        {
          id: 'payerName',
          filterable: true,
          label: 'Payer'
        }
      ];
    }

    definitions = [
      ...definitions,
      {
        id: 'categoryName',
        filterable: true,
        label: 'Diff Category'
      }
    ];

    if (!isInLeftPane) {
      definitions = [
        ...definitions,
        {
          id: 'claimId',
          filterable: true,
          label: 'Claim'
        },
        {
          id: 'chargeId',
          filterable: true,
          label: 'Charge'
        },
        {
          id: 'batchExceptionId',
          filterable: true,
          label: 'Batch Exception'
        }
      ];
    }

    definitions = [
      ...definitions,
      {
        id: 'fieldName',
        filterable: true,
        label: 'Field/Level'
      }
    ];

    if (!isInLeftPane) {
      definitions = [
        ...definitions,
        {
          id: 'statusName',
          filterable: true,
          label: 'Status'
        },
        {
          id: 'notes',
          filterable: true,
          label: 'Notes'
        }
      ];
    }

    return definitions;
  }

  renderInfo() {
    const {
      classes,
      regressionId,
      regressionName,
      fieldName,
      categoryId,
      status,
      isInLeftPane,
      onDiffSelection
    } = this.props;

    const categoryName =
      DiffCategoriesLibrary.getCategoryName(categoryId) ||
      (categoryId ? 'Uncategorized' : undefined);

    const reportPath = Path.getRegressionReportsPath(regressionId);

    return (
      <div className={classes.infoHolder}>
        {isInLeftPane && (
          <IconButton
            className={classes.unfoldIconButton}
            onClick={() => onDiffSelection(-1)}
          >
            <UnfoldMoreIcon className={classes.unfoldIcon} />
          </IconButton>
        )}
        {!isInLeftPane && (
          <Typography color="secondary">
            <Link className={classes.link} to={reportPath}>
              {'View Report'}
            </Link>
          </Typography>
        )}
        <Typography
          variant="body2"
          className={classNames(classes.info, { small: isInLeftPane })}
        >
          <span>{'Regresssion : ' + regressionName}</span>
          {categoryName && <span>{'Category : ' + categoryName}</span>}
          {fieldName && <span>{'Field : ' + fieldName}</span>}
          {status && <span>{'Status : ' + status}</span>}
        </Typography>
      </div>
    );
  }

  render() {
    const {
      diffs,
      fetchRegressionDiffs,
      onDiffSelection,
      isInLeftPane,
      selectedIndex
    } = this.props;

    const selected = selectedIndex >= 0 ? [selectedIndex] : [];

    return (
      <div className="scrollable" ref={this.setScroller}>
        {this.renderInfo()}
        <ReduxTable
          className="dense-padding"
          name={Strings.regressionDiffsTable}
          columns={this.getColumnDefinitions()}
          rows={diffs}
          title={'Diffs'}
          selected={selected}
          onSelect={onDiffSelection}
          filterable
          refreshable
          onRefresh={fetchRegressionDiffs}
          highlightAlternateRow={!isInLeftPane}
          selectedRowRef={this.setSelectedRow}
        />
      </div>
    );
  }
}

RegressionDiffsTable.defaultProps = {
  diffs: []
};

RegressionDiffsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  regressionName: PropTypes.string,
  regressionId: PropTypes.string.isRequired,
  fieldName: PropTypes.string,
  categoryId: PropTypes.string,
  status: PropTypes.string,
  diffs: PropTypes.array.isRequired,
  fetchRegressionDiffs: PropTypes.func.isRequired,
  onDiffSelection: PropTypes.func.isRequired,
  isInLeftPane: PropTypes.bool.isRequired,
  selectedIndex: PropTypes.number.isRequired
};

export default withStyles(styles)(RegressionDiffsTable);
