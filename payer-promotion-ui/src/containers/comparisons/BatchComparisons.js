import { IconButton, Tooltip, Typography, withStyles } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import React from 'react';
import { Link } from 'react-router-dom';
import Path from '../../lib/path';
import ComparisonDetails from './details';
import PropTypes from 'prop-types';
import ComparisonContext from './ComparisonContext';

const styles = {
  tabs: {
    marginTop: '0px',
    borderBottom: '1px solid #ddd',
  },
  displayFlex: {
    display: 'flex',
    flexDirection: 'row',
    margin: '15px 0px 0px 15px',
    alignItems: 'center',
  },
  spacer: {
    flex: '1 1 0%',
  },
  refreshButton: {
    marginRight: '20px',
  },
  newTabLink: {
    color: 'inherit',
    margin: '0px 10px',
  },
};

class BatchComparisons extends React.Component {
  scrollerRef = React.createRef();

  getScrollerRef = () => {
    return this.scrollerRef;
  };

  render() {
    const {
      classes,
      regressionId,
      payerId,
      paymentBatchIdentifier,
      drillDownCategory,
      drillDownStatus,
      drillDownValue,
      drillDownDiffId,
      fetchBatchComparisonResult,
    } = this.props;

    if (!regressionId || !payerId || !paymentBatchIdentifier) {
      return (
        <React.Fragment>
          <Typography className="margin" variant="body1">
            {'Payment Batch not found'}
          </Typography>
        </React.Fragment>
      );
    }

    const contextValues = {
      regressionId,
      payerId,
      paymentBatchIdentifier,
      drillDownCategory,
      drillDownStatus,
      drillDownValue,
      drillDownDiffId,
      getScrollerRef: this.getScrollerRef,
    };

    return (
      <div className="scrollable" ref={this.scrollerRef}>
        <div className={classes.displayFlex}>
          <Typography variant="headline">
            {'Batch Comparison : ' + paymentBatchIdentifier}
          </Typography>
          <div className={classes.spacer} />
          <Typography color="secondary">
            <Link
              className={classes.newTabLink}
              target="_blank"
              to={Path.getBatchComparisonsJsonPath(
                regressionId,
                payerId,
                paymentBatchIdentifier
              )}
            >
              {'View JSON'}
            </Link>
          </Typography>
          <Typography color="secondary">
            <a
              className={classes.newTabLink}
              href={Path.getBatchPdfPath(paymentBatchIdentifier)}
              target="_blank"
              rel="noreferrer"
            >
              {'View Pdf'}
            </a>
          </Typography>
          <Tooltip title="Refresh">
            <IconButton
              className={classes.refreshButton}
              aria-label="Refresh"
              onClick={() =>
                fetchBatchComparisonResult(
                  regressionId,
                  payerId,
                  paymentBatchIdentifier
                )
              }
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
        <ComparisonContext.Provider value={contextValues}>
          <ComparisonDetails />
        </ComparisonContext.Provider>
      </div>
    );
  }
}

BatchComparisons.propTypes = {
  classes: PropTypes.object.isRequired,
  regressionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  payerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  paymentBatchIdentifier: PropTypes.string.isRequired,
  drillDownCategory: PropTypes.string,
  drillDownStatus: PropTypes.string,
  drillDownValue: PropTypes.string,
  drillDownDiffId: PropTypes.string,
  fetchBatchComparisonResult: PropTypes.func.isRequired,
};

export default withStyles(styles)(BatchComparisons);
