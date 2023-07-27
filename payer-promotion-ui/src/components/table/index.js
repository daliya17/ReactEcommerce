import { Typography, withStyles } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import checkable from './checkable';
import EnhancedTableHead from './EnhancedTableHead';
import TableToolbar from './TableToolBar';
import {
  filterData,
  getColumnById,
  getSorting,
  indexedData,
  isSelectable,
  stableSort
} from './utils';
import withCollapsibleTableRows from './withCollapsibleTableRows';

const styles = {
  highlight: {
    backgroundColor: 'rgba(0, 0, 0, 0.14) !important'
  },
  selectable: {
    cursor: 'pointer'
  },
  paginationToolbar: {
    minHeight: '44px',
    height: '44px',
    marginLeft: '-22px',
    fontSize: '12px'
  },
  alternateRow: {
    backgroundColor: '#EEEEEE'
  }
};

class EnhancedTable extends React.Component {
  state = {
    selectable: isSelectable(this.props.actions)
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.actions !== nextProps.actions) {
      this.setState({
        selectable: isSelectable(nextProps.actions)
      });
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'asc';

    if (this.props.orderBy === property && this.props.order === 'asc') {
      order = 'desc';
    }

    if (this.props.onSort) {
      this.props.onSort(order, orderBy);
    }
  };

  handleClick = (index, row) => {
    if (this.props.onSelect) this.props.onSelect(index, row);
  };

  handleChangePage = (event, page) => {
    if (this.props.onChangePage) {
      this.props.onChangePage(page);
    }
  };

  handleChangeRowsPerPage = event => {
    if (this.props.onChangeRowsPerPage) {
      this.props.onChangeRowsPerPage(event.target.value);
    }
  };

  handleFilterRequest = () => {
    if (this.props.onRequestFilter) {
      this.props.onRequestFilter();
    }
  };

  handleFilter = (columnId, filterText) => {
    if (this.props.onFilter) {
      this.props.onFilter(columnId, filterText);
    }
  };

  stopEventPropagation(event) {
    if (event.stopPropagation) event.stopPropagation();
  }

  renderTableRow(row, actualIndex, isSelected, isAlternate) {
    const {
      columns,
      classes,
      onSelect,
      selectedRowRef,
      checkedIndexes,
      onCheckboxChange
    } = this.props;

    const { selectable } = this.state;
    const isChecked = !!checkedIndexes[actualIndex];

    return (
      <TableRow
        hover
        className={classNames({
          [classes.highlight]: isSelected,
          [classes.selectable]: !!onSelect,
          [classes.alternateRow]: isAlternate
        })}
        onClick={() => this.handleClick(actualIndex, row)}
        selected={isSelected}
        tabIndex={-1}
        key={'tablerow' + actualIndex}
        ref={isSelected ? selectedRowRef : undefined}
      >
        {selectable && (
          <TableCell className="min-padding">
            <Checkbox
              checked={isChecked}
              onClick={this.stopEventPropagation}
              onChange={() => onCheckboxChange(actualIndex)}
            />
          </TableCell>
        )}
        {columns.map((column, colIndex) => (
          <TableCell
            className={classNames(column.className, {
              'min-padding': column.disablePadding
            })}
            key={'cell' + actualIndex + colIndex}
            padding={column.disablePadding ? 'none' : 'default'}
          >
            {column.render
              ? column.render(row, column.id, actualIndex, colIndex)
              : row[column.id]}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  render() {
    const {
      title,
      filterable,
      addable,
      onAdd,
      addFromRangeComponent,
      addComponent,
      selected,
      columns = [],
      paginated,
      rows,
      order,
      orderBy,
      rowsPerPage,
      page,
      filterMode,
      filters,
      refreshable,
      onRefresh,
      classes,
      className,
      highlightAlternateRow,
      actions,
      checkedIndexes,
      containsCollapsibleRows
    } = this.props;

    const data = stableSort(
      indexedData(rows),
      getSorting(
        order,
        orderBy,
        (getColumnById(columns, orderBy) || {}).numeric
      )
    );

    const { selectable } = this.state;
    const numSelected = Object.keys(checkedIndexes).length;

    let filteredData = filterMode ? filterData(data, filters) : data;
    let displayData = paginated
      ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : filteredData;

    const selectedMap = {};
    selected.forEach(i => {
      selectedMap[i] = true;
    });

    return (
      <React.Fragment>
        {(title || actions.length > 0 || filterable || addable) && (
          <TableToolbar
            checkedIndexes={checkedIndexes}
            title={title}
            filterable={filterable}
            addable={addable}
            onAdd={onAdd}
            addFromRangeComponent={addFromRangeComponent}
            addComponent={addComponent}
            onRequestFilter={this.handleFilterRequest}
            refreshable={refreshable}
            onRefresh={onRefresh}
            actions={actions}
          />
        )}
        <Table className={className} aria-labelledby="tableTitle">
          <EnhancedTableHead
            columns={columns}
            numSelected={numSelected}
            order={order}
            orderBy={orderBy}
            onRequestSort={this.handleRequestSort}
            rowCount={displayData.length}
            selectable={selectable}
            filterMode={filterMode}
            filters={filters}
            onFilter={this.handleFilter}
          />
          <TableBody>
            {displayData.map((rowData, rowIndex) => {
              const row = rowData[0];
              const actualIndex = rowData[1];
              const isSelected = !!selectedMap[actualIndex];
              const isAlternate = rowIndex % 2 === 1 && highlightAlternateRow;
              return (
                <React.Fragment key={actualIndex}>
                  {this.renderTableRow(
                    row,
                    actualIndex,
                    isSelected,
                    isAlternate
                  )}
                  {containsCollapsibleRows &&
                    this.props
                      .getNestedRows(actualIndex)
                      .map((nestedRow, nestedRowIndex) =>
                        this.renderTableRow(
                          nestedRow,
                          nestedRowIndex,
                          false,
                          nestedRowIndex % 2 === 0 && highlightAlternateRow
                        )
                      )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
        {displayData.length === 0 && (
          <Typography variant="body1" className="margin">
            {'No items found'}
          </Typography>
        )}
        {paginated && (
          <TablePagination
            component="div"
            className="sticky-bottom"
            classes={{
              toolbar: classes.paginationToolbar
            }}
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[20, 50, 100, 150, 200, 250]}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        )}
      </React.Fragment>
    );
  }
}

EnhancedTable.defaultProps = {
  deletable: false,
  filterable: false,
  addable: false,
  selected: [],
  paginated: true,
  rowsPerPage: 50,
  order: 'asc',
  orderBy: '',
  page: 0,
  filterMode: false,
  filters: {},
  refreshable: false,
  highlightAlternateRow: false,
  actions: [],
  checkedIndexes: {},
  containsCollapsibleRows: false
};

EnhancedTable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object
  ]),
  filterable: PropTypes.bool,
  onFilter: PropTypes.func,
  addable: PropTypes.bool,
  onAdd: PropTypes.func,
  selected: PropTypes.array,
  onSelect: PropTypes.func,
  columns: EnhancedTableHead.propTypes.columns,
  paginated: PropTypes.bool,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSort: PropTypes.func,
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  onRequestFilter: PropTypes.func,
  rowsPerPage: PropTypes.number,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string,
  page: PropTypes.number.isRequired,
  filterMode: PropTypes.bool.isRequired,
  filters: PropTypes.object.isRequired,
  selectedRowRef: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  refreshable: PropTypes.bool,
  onRefresh: PropTypes.func,
  highlightAlternateRow: PropTypes.bool.isRequired,
  checkedIndexes: PropTypes.object.isRequired,
  onCheckboxChange: PropTypes.func,
  containsCollapsibleRows: PropTypes.bool.isRequired,
  getNestedRows: PropTypes.func,
  actions: PropTypes.array.isRequired
};

export default checkable(
  withCollapsibleTableRows(withStyles(styles)(EnhancedTable))
);
