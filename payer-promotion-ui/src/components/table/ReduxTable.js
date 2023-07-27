import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ActionCreators from './reduxtableactions';
import Table from './index';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  const tableName = props.name;
  const tables = state.tables || {};
  const tableData = tables[tableName] || {};

  return {
    ...props,
    ...tableData
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...ActionCreators
    },
    dispatch
  );
}

/**
 * This component is used to bind the table to the redux store
 * name of the table is used to store the data related to this table
 * in redux store
 */
class ReduxTable extends React.Component {
  componentDidUpdate(prevProps) {
    const { rows, name, selected, rowsPerPage, orderBy } = this.props;
    if (
      rows.length > 0 &&
      prevProps.selected.length === 0 &&
      selected.length === 1 &&
      selected[0] > rowsPerPage &&
      !orderBy
    ) {
      this.props.updatePageChange(
        name,
        parseInt(selected[0] / rowsPerPage, 10)
      );
    }
  }

  addNameArg = method => {
    const { name } = this.props;
    return (...args) => method(name, ...args);
  };

  render() {
    return (
      <Table
        {...this.props}
        onSort={this.addNameArg(this.props.updateTableSort)}
        onChangePage={this.addNameArg(this.props.updatePageChange)}
        onChangeRowsPerPage={this.addNameArg(
          this.props.updateRowsPerPageChange
        )}
        onRequestFilter={this.addNameArg(this.props.updateFilterMode)}
        onFilter={this.addNameArg(this.props.updateFilterText)}
      />
    );
  }
}

ReduxTable.defaultProps = {
  rowsPerPage: 50,
  order: 'asc',
  orderBy: '',
  page: 0,
  filterMode: false,
  filters: {},
  selected: []
};

ReduxTable.propTypes = {
  rows: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  rowsPerPage: PropTypes.number,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string,
  page: PropTypes.number.isRequired,
  filterMode: PropTypes.bool.isRequired,
  filters: PropTypes.object.isRequired,
  selected: PropTypes.arrayOf(PropTypes.number).isRequired,
  updatePageChange: PropTypes.func.isRequired,
  updateTableSort: PropTypes.func.isRequired,
  updateRowsPerPageChange: PropTypes.func.isRequired,
  updateFilterMode: PropTypes.func.isRequired,
  updateFilterText: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxTable);
