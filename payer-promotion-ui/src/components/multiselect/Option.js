import { Checkbox, ListItem, ListItemText } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const Option = ({
  classes,
  onOptionClick,
  onCheckboxChange,
  isSelected,
  label,
  isHighlighted,
  isIntermediate
}) => {
  return (
    <ListItem
      className={classes.listItem}
      dense
      button
      onClick={onOptionClick}
      selected={isHighlighted}
    >
      <Checkbox
        className={classes.listItemCheckbox}
        checked={isSelected}
        indeterminate={isIntermediate}
        tabIndex={-1}
        disableRipple
        onChange={onCheckboxChange}
      />
      <ListItemText primary={label} className={classes.listItemText} />
    </ListItem>
  );
};

Option.propTypes = {
  onOptionClick: PropTypes.func.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    listItem: PropTypes.string,
    listItemCheckbox: PropTypes.string,
    listItemText: PropTypes.string
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  isIntermediate: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  isHighlighted: PropTypes.bool.isRequired
};

Option.defaultProps = {
  classes: {},
  isSelected: false,
  isHighlighted: false
};

export default Option;
