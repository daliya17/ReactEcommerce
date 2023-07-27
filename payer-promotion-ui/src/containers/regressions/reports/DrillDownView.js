import { Typography, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import ReduxTable from '../../../components/table/ReduxTable';
import Strings from '../../../constants/strings.json';
import Path from '../../../lib/path';
import Request from '../../../lib/request';
import Selector from '../../../lib/selectors';
import ScoreBuckets from '../../../constants/ScoreBuckets';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  return {
    ...Selector.regressionReportDrillDown(state, props)
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

const styles = {
  label: {
    marginLeft: '16px',
    marginTop: '15px',
    display: 'inline-block'
  },
  link: {
    float: 'right',
    margin: '20px 15px 0px 0px'
  }
};

class DrillDownView extends React.Component {
  static defaultProps = {};

  getDrillDownColumns() {
    let columns = [
      { id: 'batchId', label: 'Payment Batch', filterable: true },
      { id: 'payer', label: 'Payer' }
    ];

    if (this.props.category === 'score') {
      columns.push({ id: 'score', label: 'Score' });
    } else if (this.props.category === 'status') {
      columns.push({ id: 'status', label: 'Status' });
    } else {
      columns.push({ id: 'count', label: '#' });
    }

    return columns;
  }

  handleSelection = index => {
    const {
      selectedIndex,
      batches,
      regressionId,
      category,
      id,
      status,
      statusCategory,
      statusName
    } = this.props;
    if (index !== selectedIndex) {
      const batchId = (batches[index] || {}).batchId;
      const payerId = (batches[index] || {}).payerId;

      if (batchId && payerId) {
        const url =
          Path.getRegressionReportsPath(regressionId) +
          Request.constructQueryParams({
            category,
            id,
            status,
            batchId,
            payerId,
            statusCategory,
            statusName
          });

        Path.redirect(url);
      }
    }
  };

  renderInfo() {
    const { classes, drilldown } = this.props;

    if (drilldown.category === 'score') {
      return (
        <Typography className={classes.label} variant="caption">
          {'having ' + drilldown.category + ' '}
          <b>{ScoreBuckets[drilldown.id]}</b>
        </Typography>
      );
    }

    if (drilldown.category === 'status') {
      const statusMessage = drilldown.statusName
        ? ' and status as ' + drilldown.statusName
        : '';
      return (
        <Typography className={classes.label} variant="caption">
          {'having status category '}
          <b>{drilldown.statusCategory}</b>
          {statusMessage}
        </Typography>
      );
    }

    return (
      <Typography className={classes.label} variant="caption">
        {'having ' + drilldown.category + ' '}
        <b>{drilldown.id}</b>
        {' with status '}
        <b>{drilldown.status}</b>
      </Typography>
    );
  }

  render() {
    const {
      classes,
      batches,
      selectedIndex,
      batchId,
      regressionId,
      id,
      status,
      category,
      statusCategory,
      statusName
    } = this.props;

    const selected = selectedIndex > -1 ? [selectedIndex] : [];
    const requestParams = Request.constructQueryParams({
      id,
      status,
      category,
      statusCategory,
      statusName
    });
    const url = Path.getRegressionReportsPath(regressionId) + requestParams;

    return (
      <React.Fragment>
        {batchId && (
          <Link to={url} className={'link ' + classes.link}>
            <Typography variant="body2" color="secondary">
              {'View report'}
            </Typography>
          </Link>
        )}
        <Typography variant="title" className="headline">
          {'Payment Batches'}
        </Typography>

        {this.renderInfo()}

        <ReduxTable
          className="dense-padding"
          name={Strings.regressionDrilldownTable}
          columns={this.getDrillDownColumns()}
          rows={batches}
          selected={selected}
          onSelect={this.handleSelection}
          filterable
          orderBy="count"
          order="desc"
        />
      </React.Fragment>
    );
  }
}

DrillDownView.propTypes = {
  drilldown: PropTypes.shape({
    category: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }).isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DrillDownView));
