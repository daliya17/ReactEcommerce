import PropTypes from 'prop-types';
import React from 'react';
import { Typography, Checkbox, Input, List } from '@material-ui/core';
import Option from './Option';

const MultiSelect = ({
  classes,
  options,
  onOptionClick,
  onCheckboxChange,
  totalSelectionCount,
  canToggleMultiple,
  displaySelectionCount,
  onToggleAll,
  filterText,
  onFilterChange
}) => (
  <div className={classes.root}>
    <Typography variant="caption" className={classes.caption}>
      {totalSelectionCount + ' selected'}
    </Typography>
    <div className={classes.searchbar}>
      {canToggleMultiple && (
        <Checkbox
          color="secondary"
          className={classes.toggleAllCheckbox}
          checked={displaySelectionCount > 0}
          indeterminate={
            displaySelectionCount > 0 && displaySelectionCount < options.length
          }
          onClick={() => onToggleAll(options, displaySelectionCount)}
        />
      )}
      <Input
        className={classes.filterInput + ' inputnoborder'}
        placeholder={'Search'}
        onChange={onFilterChange}
        value={filterText}
      />
    </div>
    <div className={classes.listContainer}>
      <List>
        {options.map((option, index) => (
          <Option
            key={option.value || 'option' + index}
            classes={{
              listItem: classes.listItem,
              listItemCheckbox: classes.listItemCheckbox,
              listItemText: classes.listItemText
            }}
            label={option.label}
            isSelected={option.isSelected}
            isIntermediate={option.isIntermediate}
            isHighlighted={option.isHighlighted}
            onOptionClick={event => onOptionClick(event, option)}
            onCheckboxChange={event => onCheckboxChange(event, option)}
          />
        ))}
      </List>
    </div>
  </div>
);

MultiSelect.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    caption: PropTypes.string,
    searchbar: PropTypes.string,
    toggleAllCheckbox: PropTypes.string,
    filterInput: PropTypes.string,
    listContainer: PropTypes.string,
    listItem: PropTypes.string,
    listItemCheckbox: PropTypes.string,
    listItemText: PropTypes.string
  }).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      originalIndex: PropTypes.number.isRequired,
      isSelected: PropTypes.bool.isRequired,
      isIntermediate: PropTypes.bool.isRequired,
      isHighlighted: PropTypes.bool.isRequired
    })
  ).isRequired,
  onOptionClick: PropTypes.func.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  totalSelectionCount: PropTypes.number.isRequired,
  canToggleMultiple: PropTypes.bool.isRequired,
  displaySelectionCount: PropTypes.number.isRequired,
  onToggleAll: PropTypes.func.isRequired,
  filterText: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired
};

MultiSelect.defaultProps = {
  classes: {},
  canToggleMultiple: false
};

export default MultiSelect;
