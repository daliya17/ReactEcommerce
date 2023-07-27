import { withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import FilterListIcon from '@material-ui/icons/FilterList';
import RefreshIcon from '@material-ui/icons/Refresh';
import classNames from 'classnames';
import React from 'react';
import TableActions from './TableActions';

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: '1 1 0%'
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: '0 0 auto'
  }
});

const TableToolBar = props => {
  const {
    checkedIndexes,
    classes,
    title,
    filterable,
    onRequestFilter,
    addable,
    addFromRangeComponent,
    addComponent,
    onAdd,
    refreshable,
    onRefresh,
    actions
  } = props;

  return (
    <Toolbar className={classNames(classes.root)}>
      <div className={classes.title}>
        {typeof title === 'string' && (
          <Typography variant="headline" id="tableTitle">
            {title}
          </Typography>
        )}
        {typeof title === 'object' && title}
        {typeof title === 'function' && title()}
      </div>
      <TableActions actions={actions} checkedIndexes={checkedIndexes} />
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {addFromRangeComponent &&
          React.createElement(addFromRangeComponent, {})}
        {refreshable &&
          onRefresh && (
            <Tooltip title="Refresh">
              <IconButton aria-label="Refresh" onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
        {filterable &&
          onRequestFilter && (
            <Tooltip title="Filter">
              <IconButton aria-label="Filter" onClick={onRequestFilter}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
        {addable &&
          (onAdd || addComponent) &&
          (addComponent ? (
            React.createElement(addComponent, {})
          ) : (
            <Tooltip title="Add to list">
              <IconButton aria-label="Add to list" onClick={onAdd}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          ))}
      </div>
    </Toolbar>
  );
};

export default withStyles(toolbarStyles)(TableToolBar);
