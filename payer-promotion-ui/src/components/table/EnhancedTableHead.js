import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';
import { TextField } from '@material-ui/core';
import classNames from 'classnames';

/**
 * Used As table header
 */
class EnhancedTableHead extends React.Component {
  static propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAll: PropTypes.func,
    selectable: PropTypes.bool.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        numeric: PropTypes.bool,
        disablePadding: PropTypes.bool,
        label: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.func,
          PropTypes.object
        ]).isRequired,
        width: PropTypes.string,
        columnName: PropTypes.string,
        render: PropTypes.func
      })
    ).isRequired,
    filterMode: PropTypes.bool.isRequired,
    filters: PropTypes.object.isRequired,
    onFilter: PropTypes.func.isRequired
  };

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  getFilterableColumns() {
    const filterableColumns = {};
    const { columns = [] } = this.props;
    columns.forEach(col => {
      if (col.filterable) filterableColumns[col.id] = true;
    });
    return filterableColumns;
  }

  handleFilterInput = (columnId, event) => {
    this.props.onFilter(columnId, event.target.value);
  };

  render() {
    const {
      columns,
      onSelectAll,
      order,
      orderBy,
      numSelected,
      rowCount,
      selectable,
      filterMode,
      filters
    } = this.props;
    const filterableColumns = this.getFilterableColumns();

    return (
      <TableHead>
        <TableRow>
          {selectable && (
            <TableCell padding="none" className="min-padding sticky-top">
              {onSelectAll && (
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={numSelected === rowCount}
                  onChange={onSelectAll}
                />
              )}
            </TableCell>
          )}
          {columns.map(column => {
            const filterText = filters[column.id] || '';
            return (
              <TableCell
                className={classNames('sticky-top', {
                  'min-padding': column.disablePadding
                })}
                key={column.id}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
                width={column.width}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    className={column.className}
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {typeof column.label === 'string' && column.label}
                    {typeof column.label === 'object' && column.label}
                    {typeof column.label === 'function' && column.label()}
                  </TableSortLabel>
                </Tooltip>
                {filterMode &&
                  filterableColumns[column.id] && (
                    <div>
                      <TextField
                        value={filterText}
                        placeholder="Filter"
                        onChange={e => this.handleFilterInput(column.id, e)}
                      />
                    </div>
                  )}
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

export default EnhancedTableHead;
