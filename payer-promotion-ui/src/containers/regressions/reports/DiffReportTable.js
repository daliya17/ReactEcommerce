import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
  withStyles
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import ReduxTable from '../../../components/table/ReduxTable';
import FieldStatuses from '../../../constants/FieldStatuses';
import Strings from '../../../constants/strings.json';
import { textColors } from '../../comparisons/colors';
import Path from '../../../lib/path';
import request from '../../../lib/request';

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
  oneLiner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '10px',
    color: '#777',

    '& label,span': {
      fontSize: '13px'
    }
  },
  ...textColors
};

class DiffReportTables extends React.Component {
  state = {
    sourceIndex: 0
  };

  getSource = () => {
    const { sourceIndex } = this.state;

    return this.props.sources[sourceIndex] || {};
  };

  getColumnDefinitions() {
    const { classes } = this.props;
    const { primaryLabel } = this.getSource();

    return [
      {
        id: 'type',
        label: primaryLabel
      },
      {
        id: 'total',
        label: 'Total #',
        numeric: true,
        render: this.renderStatusCount()
      },
      {
        id: FieldStatuses.Matched,
        label: 'Matched #',
        numeric: true,
        render: this.renderStatusCount(FieldStatuses.Matched)
      },
      {
        id: FieldStatuses.Added,
        label: 'Added #',
        numeric: true,
        className: classes.addedTxt,
        render: this.renderStatusCount(FieldStatuses.Added)
      },
      {
        id: FieldStatuses.Different,
        label: 'Different #',
        numeric: true,
        className: classes.differentTxt,
        render: this.renderStatusCount(FieldStatuses.Different)
      },
      {
        id: FieldStatuses.Removed,
        label: 'Removed #',
        numeric: true,
        className: classes.removedTxt,
        render: this.renderStatusCount(FieldStatuses.Removed)
      },
      {
        id: FieldStatuses.Ignored,
        label: 'Ignored #',
        numeric: true,
        render: this.renderStatusCount(FieldStatuses.Ignored)
      }
    ];
  }

  handleDrillDownClick = (category, field, status) => {
    const regressionId = Path.getSelectedRegression();
    const url =
      Path.getRegressionDiffsPath(regressionId) +
      request.constructQueryParams({
        categoryId: category,
        fieldName: field,
        status: status
      });

    Path.redirect(url);
  };

  renderStatusCount = status => row => {
    const count = status ? row[status] || 0 : row.total;
    if (!count) return count;

    return (
      <span
        style={{ cursor: 'pointer' }}
        onClick={() =>
          this.handleDrillDownClick(row.category, row.field, status)
        }
      >
        {count}
      </span>
    );
  };

  handleGroupByChange = event => {
    this.setState({
      sourceIndex: parseInt(event.target.value, 10)
    });
  };

  renderTitle() {
    const { classes, title, sources } = this.props;
    const { sourceIndex } = this.state;

    return (
      <span className={classes.oneLiner}>
        <Typography variant="title" className={classes.reportTitle}>
          {title}
        </Typography>
        {sources.length > 1 && (
          <FormControl className={classes.oneLiner}>
            <FormLabel>Group by</FormLabel>
            <RadioGroup
              className={classes.oneLiner}
              value={sourceIndex + ''}
              onChange={this.handleGroupByChange}
            >
              {sources.map((source, index) => (
                <FormControlLabel
                  key={index + ''}
                  value={index + ''}
                  control={<Radio />}
                  label={source.primaryLabel}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )}
      </span>
    );
  }

  render() {
    const { classes } = this.props;
    const { data = [] } = this.getSource();

    return (
      <div className={classes.report}>
        <ReduxTable
          title={this.renderTitle()}
          className={classes.reportTable + ' dense-padding'}
          name={Strings.regressionFieldsReportTable}
          columns={this.getColumnDefinitions()}
          rows={data}
          containsCollapsibleRows
          rowsPerPage={10}
          highlightAlternateRow
          orderBy="total"
          order="desc"
          filterable
        />
      </div>
    );
  }
}

DiffReportTables.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  sources: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.array.isRequired,
      primaryLabel: PropTypes.string.isRequired
    })
  ).isRequired
};

export default withStyles(styles)(DiffReportTables);
