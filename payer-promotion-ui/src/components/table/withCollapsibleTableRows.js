import React from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles, IconButton } from '@material-ui/core';
import classNames from 'classnames';

const styles = {
  expandIcon: {
    transform: 'rotate(-90deg)',
    color: '#777',

    '&.expanded': {
      transform: 'rotate(0deg)'
    }
  },
  iconButton: {
    padding: '4px',
    margin: '0px 4px 0px 0px'
  },
  childRowSpan: {
    marginLeft: '70px'
  }
};

export default WrappedComponent => {
  class CollapsibleTableRows extends React.Component {
    state = {
      expandedRows: {}
    };

    componentWillReceiveProps(nextProps) {
      if (this.props.rows !== nextProps.rows) {
        this.setState({
          expandedRows: {}
        });
      }
    }

    getColumnDefinitions() {
      const { columns } = this.props;

      let firstColumn = columns[0];

      if (firstColumn) {
        firstColumn = {
          ...firstColumn,
          render: this.renderFirstColumn
        };

        return [firstColumn, ...columns.slice(1)];
      }

      return columns;
    }

    getNestedRows = index => {
      if (this.state.expandedRows[index])
        return (this.props.rows[index] || {}).children || [];
      return [];
    };

    rowExpansionHandler = index => () => {
      this.setState(prevState => ({
        expandedRows: {
          ...prevState.expandedRows,
          [index]: !prevState.expandedRows[index]
        }
      }));
    };

    renderFirstColumn = (row, columnId, index) => {
      const { classes } = this.props;
      const expanded = this.state.expandedRows[index];

      if (row.children && row.children.length > 0) {
        return (
          <React.Fragment>
            <IconButton
              className={classes.iconButton}
              disableRipple
              onClick={this.rowExpansionHandler(index)}
            >
              <ExpandMoreIcon
                className={classNames(classes.expandIcon, {
                  expanded
                })}
              />
            </IconButton>
            {row[columnId]}
          </React.Fragment>
        );
      }

      return <span className={classes.childRowSpan}>{row[columnId]}</span>;
    };

    render() {
      // this is to skip the classes being passed to the wrapped component
      const { classes, ...props } = this.props;
      if (!props.containsCollapsibleRows)
        return <WrappedComponent {...props} />;

      return (
        <WrappedComponent
          {...props}
          columns={this.getColumnDefinitions()}
          getNestedRows={this.getNestedRows}
        />
      );
    }
  }

  CollapsibleTableRows.defaultProps = {
    containsCollapsibleRows: false
  };

  CollapsibleTableRows.propTypes = {
    classes: PropTypes.object.isRequired,
    containsCollapsibleRows: PropTypes.bool.isRequired,
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired
  };

  return withStyles(styles)(CollapsibleTableRows);
};
