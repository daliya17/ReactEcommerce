import React from 'react';
import PropTypes from 'prop-types';
import {
  Select,
  OutlinedInput,
  FormControl,
  InputLabel,
  MenuItem,
  withStyles
} from '@material-ui/core';

const styles = {
  formControl: {
    margin: '0px 10px',
    minWidth: 160
  }
};

class TableActions extends React.Component {
  static defaultProps = {
    checkedIndexes: {}
  };

  static propTypes = {
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        selectionType: PropTypes.oneOf(['single', 'multiple', 'none'])
          .isRequired,
        handler: PropTypes.func.isRequired,
        disabled: PropTypes.func
      })
    ).isRequired,
    checkedIndexes: PropTypes.object.isRequired
  };

  handleClick = event => {
    const id = event.target.value;
    const { actions, checkedIndexes } = this.props;

    actions.forEach(action => {
      if (action.id === id && action.handler) {
        action.handler(Object.keys(checkedIndexes));
      }
    });
  };

  render() {
    const { actions, classes, checkedIndexes } = this.props;
    const numSelected = Object.keys(checkedIndexes).length;

    if (actions.length < 1) return null;

    return (
      <FormControl
        variant="outlined"
        margin="dense"
        className={classes.formControl}
      >
        <InputLabel htmlFor="outlined-table-actions">Actions</InputLabel>
        <Select
          value=""
          input={<OutlinedInput labelWidth={160} id="outlined-table-actions" />}
          onChange={this.handleClick}
        >
          {actions.map(action => {
            let isEnabled =
              (numSelected === 1 && action.selectionType === 'single') ||
              (numSelected > 0 && action.selectionType === 'multiple') ||
              action.selectionType === 'none';

            if (isEnabled && action.disabled) {
              isEnabled = !action.disabled(Object.keys(checkedIndexes));
            }

            return (
              <MenuItem value={action.id} key={action.id} disabled={!isEnabled}>
                {action.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  }
}

export default withStyles(styles)(TableActions);
