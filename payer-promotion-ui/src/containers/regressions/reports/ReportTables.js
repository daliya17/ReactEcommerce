import { Typography, withStyles, IconButton, Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import ReduxTable from '../../../components/table/ReduxTable';
import FieldStatuses from '../../../constants/FieldStatuses';
import Strings from '../../../constants/strings.json';
import lib from '../../../lib';
import Path from '../../../lib/path';
import Request from '../../../lib/request';
import { textColors } from '../../comparisons/colors';
import DiffReportTable from './DiffReportTable';
import RefreshIcon from '@material-ui/icons/Refresh';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  const regressionsView = state.views.regressions;
  const { report, data: regressions } = regressionsView;
  const regressionId = Path.getSelectedRegression();
  const index = lib.getRegressionIndex(regressions, regressionId);
  const regressionName = (regressions[index] || {}).name;

  return {
    report: report[regressionId],
    regressionId,
    regressionName
  };
}

const styles = {
  report: {
    margin: '25px 15px'
  },
  reportTable: {
    border: '1px solid #ddd'
  },
  reportTitle: {
    color: '#555',
    marginLeft: '-25px'
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    margin: '15px 15px 0px 0px'
  },
  ...textColors
};

class ReportTables extends React.Component {
  static defaultProps = {};

  getLevelsReportColumnDefinition() {
    if (!this.levelsColumns) {
      const { classes } = this.props;

      this.levelsColumns = [
        {
          id: 'id',
          label: 'Level'
        },
        {
          id: 'total',
          label: 'Total #',
          numeric: true
        },
        {
          id: FieldStatuses.Added + 'count',
          label: 'Added #',
          numeric: true,
          className: classes.addedTxt,
          render: this.renderStatusCount('level', FieldStatuses.Added)
        },
        {
          id: FieldStatuses.Removed + 'count',
          label: 'Removed #',
          numeric: true,
          className: classes.removedTxt,
          render: this.renderStatusCount('level', FieldStatuses.Removed)
        }
      ];
    }

    return this.levelsColumns;
  }

  getFieldsReportColumnDefinition() {
    if (!this.fieldsColumns) {
      const { classes } = this.props;

      this.fieldsColumns = [
        {
          id: 'id',
          label: 'Field',
          filterable: true
        },
        {
          id: 'total',
          label: 'Total #',
          numeric: true
        },
        {
          id: FieldStatuses.Added + 'count',
          label: 'Added #',
          numeric: true,
          className: classes.addedTxt,
          render: this.renderStatusCount('field', FieldStatuses.Added)
        },
        {
          id: FieldStatuses.Different + 'count',
          label: 'Different #',
          numeric: true,
          className: classes.differentTxt,
          render: this.renderStatusCount('field', FieldStatuses.Different)
        },
        {
          id: FieldStatuses.Removed + 'count',
          label: 'Removed #',
          numeric: true,
          className: classes.removedTxt,
          render: this.renderStatusCount('field', FieldStatuses.Removed)
        },
        {
          id: FieldStatuses.Ignored + 'count',
          label: 'Ignored #',
          numeric: true,
          render: this.renderStatusCount('field', FieldStatuses.Ignored)
        }
      ];
    }

    return this.fieldsColumns;
  }

  getRulesFiredColumnDefinitions() {
    if (!this.rulesColumns) {
      const { classes } = this.props;

      this.rulesColumns = [
        {
          id: 'id',
          label: 'Rule',
          filterable: true
        },
        {
          id: 'total',
          label: 'Total #',
          numeric: true
        },
        {
          id: FieldStatuses.Matched + 'count',
          label: 'Matched #',
          numeric: true,
          render: this.renderStatusCount('rule', FieldStatuses.Matched)
        },
        {
          id: FieldStatuses.Added + 'count',
          label: 'Added #',
          numeric: true,
          className: classes.addedTxt,
          render: this.renderStatusCount('rule', FieldStatuses.Added)
        },
        {
          id: FieldStatuses.Different + 'count',
          label: 'Different #',
          numeric: true,
          className: classes.differentTxt,
          render: this.renderStatusCount('rule', FieldStatuses.Different)
        },
        {
          id: FieldStatuses.Removed + 'count',
          label: 'Removed #',
          numeric: true,
          className: classes.removedTxt,
          render: this.renderStatusCount('rule', FieldStatuses.Removed)
        },
        {
          id: FieldStatuses.Ignored + 'count',
          label: 'Ignored #',
          numeric: true,
          render: this.renderStatusCount('rule', FieldStatuses.Ignored)
        }
      ];
    }

    return this.rulesColumns;
  }

  getStatusColumns() {
    if (!this.statusColumns) {
      this.statusColumns = [
        {
          id: 'group',
          label: 'Status Category'
        },
        {
          id: 'count',
          label: 'No. of batches',
          numeric: true,
          render: this.renderStatusCategoryCount
        }
      ];
    }

    return this.statusColumns;
  }

  getScoreBucketColumns() {
    if (!this.bucketColumns) {
      this.bucketColumns = [
        {
          id: 'name',
          label: 'Score'
        },
        {
          id: 'count',
          label: 'No. of batches',
          numeric: true,
          render: this.renderBucketCount
        }
      ];
    }

    return this.bucketColumns;
  }

  handleDrillDownClick = (category, id, status) => {
    const { regressionId } = this.props;
    const queryParams = Request.constructQueryParams({
      category,
      id,
      status
    });
    const url = Path.getRegressionReportsPath(regressionId) + queryParams;
    Path.redirect(url);
  };

  handleStatusCategoryDrillDownClick = (
    category,
    id,
    statusCategory,
    statusName
  ) => {
    const { regressionId } = this.props;
    const queryParams = Request.constructQueryParams({
      category,
      id,
      statusCategory,
      statusName
    });
    const url = Path.getRegressionReportsPath(regressionId) + queryParams;
    Path.redirect(url);
  };

  renderBucketCount = row => {
    const count = row.count || 0;
    if (!count) return count;

    return (
      <span
        style={{ cursor: 'pointer' }}
        onClick={() =>
          this.handleDrillDownClick('score', row.id, FieldStatuses.Added)
        }
      >
        {count}
      </span>
    );
  };

  renderStatusCount = (category, status) => row => {
    const count = row[status + 'count'] || 0;
    if (!count) return count;

    return (
      <span
        style={{ cursor: 'pointer' }}
        onClick={() => this.handleDrillDownClick(category, row.id, status)}
      >
        {count}
      </span>
    );
  };

  renderStatusCategoryCount = row => {
    const count = row.count || 0;
    if (!count) return count;

    return (
      <span
        style={{ cursor: 'pointer' }}
        onClick={() =>
          this.handleStatusCategoryDrillDownClick(
            'status',
            row.id,
            row.statusCategory,
            row.status
          )
        }
      >
        {count}
      </span>
    );
  };

  render() {
    const { classes, report, regressionName, fetchReport } = this.props;

    if (!report)
      return (
        <Typography variant="body2">{'Loading regression report'}</Typography>
      );

    return (
      <div className="scrollable">
        <div className={classes.titleWrapper}>
          <Typography variant="headline" className="headline">
            {'Regression report : ' + regressionName}
          </Typography>
          <Tooltip title="Refresh">
            <IconButton
              aria-label="Refresh"
              className={classes.button}
              onClick={fetchReport}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>

        {report.levelCategories.fieldFirst.length > 0 ? (
          <DiffReportTable
            title="Levels"
            sources={[
              {
                data: report.levelCategories.categoryFirst,
                primaryLabel: 'Diff Category'
              },
              {
                data: report.levelCategories.fieldFirst,
                primaryLabel: 'Level'
              }
            ]}
          />
        ) : (
          <div className={classes.report}>
            <ReduxTable
              title={
                <Typography variant="title" className={classes.reportTitle}>
                  {'Levels mismatch'}
                </Typography>
              }
              className={classes.reportTable + ' dense-padding'}
              name={Strings.regressionLevelsReportTable}
              columns={this.getLevelsReportColumnDefinition()}
              rows={report.levels}
              rowsPerPage={10}
              highlightAlternateRow
              orderBy="total"
              order="desc"
            />
          </div>
        )}

        {report.fieldCategories.categoryFirst.length > 0 ? (
          <DiffReportTable
            title="Fields"
            sources={[
              {
                data: report.fieldCategories.categoryFirst,
                primaryLabel: 'Diff Category'
              },
              {
                data: report.fieldCategories.fieldFirst,
                primaryLabel: 'Field'
              }
            ]}
          />
        ) : (
          <div className={classes.report}>
            <ReduxTable
              title={
                <Typography variant="title" className={classes.reportTitle}>
                  {'Fields mismatch'}
                </Typography>
              }
              className={classes.reportTable + ' dense-padding'}
              name={Strings.regressionFieldsReportTable}
              columns={this.getFieldsReportColumnDefinition()}
              rows={report.fields}
              rowsPerPage={10}
              highlightAlternateRow
              orderBy="total"
              order="desc"
              filterable
            />
          </div>
        )}

        <div className={classes.report}>
          <ReduxTable
            title={
              <Typography variant="title" className={classes.reportTitle}>
                {'Rules Fired'}
              </Typography>
            }
            className={classes.reportTable + ' dense-padding'}
            name={Strings.regressionRulesFiredTable}
            columns={this.getRulesFiredColumnDefinitions()}
            rows={report.rules}
            rowsPerPage={10}
            highlightAlternateRow
            orderBy="total"
            order="desc"
            filterable
          />
        </div>

        <div className={classes.report}>
          <ReduxTable
            title={
              <Typography variant="title" className={classes.reportTitle}>
                {'Status'}
              </Typography>
            }
            className={classes.reportTable + ' dense-padding'}
            name={Strings.regressionStatusTable}
            columns={this.getStatusColumns()}
            rows={report.statusCategory}
            containsCollapsibleRows
            rowsPerPage={10}
            highlightAlternateRow
            orderBy="total"
            order="desc"
            filterable
          />
        </div>

        <div className={classes.report}>
          <ReduxTable
            title={
              <Typography variant="title" className={classes.reportTitle}>
                {'Score bucket'}
              </Typography>
            }
            className={classes.reportTable + ' dense-padding'}
            name={Strings.regressionScoreBucketTable}
            columns={this.getScoreBucketColumns()}
            rows={report.batches}
            rowsPerPage={10}
            highlightAlternateRow
            orderBy="total"
            order="desc"
            filterable
          />
        </div>
      </div>
    );
  }
}

ReportTables.propTypes = {
  classes: PropTypes.object.isRequired,
  report: PropTypes.object,
  regressionId: PropTypes.string,
  regressionName: PropTypes.string,
  fetchReport: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(ReportTables));
