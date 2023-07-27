import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import MultiSelect from './MultiSelect';

const styles = {
  listContainer: {
    height: 'calc(100% - 90px)',
    overflow: 'auto',
    position: 'relative',
    background: 'white',
    border: '2px solid #e8e8e8',
    borderTop: 'none'
  },
  listItem: {
    padding: '6px 12px'
  },
  listItemCheckbox: {
    padding: '6px 12px'
  },
  listItemText: {
    padding: '0px 10px',
    fontSize: '15px'
  },
  searchbar: {
    display: 'flex',
    background: '#e8e8e8',
    border: '2px solid #e8e8e8',
    height: '46px',
    alignItems: 'center',
    padding: '0px 10px'
  },
  toggleAllCheckbox: {
    marginRight: '10px'
  },
  filterInput: {
    border: 'none',
    background: '#f5f5f5',
    padding: '2px 10px',
    fontSize: '16px',
    height: '30px',
    flexGrow: 1
  },
  caption: {
    display: 'flex',
    flexFlow: 'row-reverse'
  }
};

class MultiSelectContainer extends React.Component {
  state = {
    filterText: ''
  };

  handleFilterChange = event => {
    this.setState({
      filterText: (event.target.value || '').toLowerCase()
    });
  };

  handleToggleAll = (displayOptions, displayCount) => {
    if (displayCount < displayOptions.length) {
      this.handleSelectAll(displayOptions);
    } else {
      this.handleClearAll(displayOptions);
    }
  };

  handleSelectAll = displayOptions => {
    if (this.props.onMultiSelect) {
      const notSelectedIndexesMap = {};
      displayOptions.forEach(option => {
        if (!option.isSelected) {
          notSelectedIndexesMap[option.originalIndex] = 1;
        }
      });
      this.props.onMultiSelect(notSelectedIndexesMap);
    }
  };

  handleClearAll = displayOptions => {
    if (this.props.onMultiClear) {
      const selectedIndexesMap = {};
      displayOptions.forEach(option => {
        selectedIndexesMap[option.originalIndex] = 1;
      });
      this.props.onMultiClear(selectedIndexesMap);
    }
  };

  /**
   * Hightligh mode works in a different way.
   * Requirement:
   *  When the checkbox of the option is clicked, onToggle and
   *  onHighlight should be called. With onToggle being called first
   *  and onHightlight called later.
   *  When it is clicked elsewhere in the option, only onHighlight
   *  should be called.
   *
   * Working:
   *  When the checkbox of the option is clicked, onOptionClick is called
   *  first and then the checkbox change is called. So onOptionClick check
   *  the target element. If the click is made on checkbox, call onToggle.
   *  Else call onHighlight.
   */
  handleOptionClick = (event, option) => {
    if (this.props.highlightable) {
      const tagName = (event.target || {}).tagName;
      if (tagName !== 'INPUT') {
        if (this.props.onHighlight)
          this.props.onHighlight(option.originalIndex);
        return;
      }
    }
    this.props.onToggle(option.originalIndex);
  };

  handleCheckboxChange = (event, option) => {
    // if (this.props.highlightable && this.props.onHighlight)s
    // this.props.onHighlight(option.originalIndex);
  };

  isFiltered(text) {
    const { filterText } = this.state;
    return !filterText || (text || '').toLowerCase().indexOf(filterText) >= 0;
  }

  getOptions() {
    let {
      options: actualOptions = [],
      selectedValues = {},
      highlightedIndex
    } = this.props;
    let displayOptions = [];
    let displaySelectionCount = 0;

    actualOptions.forEach((option, index) => {
      if (!this.isFiltered(option.label)) return;

      displayOptions.push({
        ...option,
        originalIndex: index,
        isSelected: selectedValues[index] !== undefined,
        isIntermediate: selectedValues[index] === 0,
        isHighlighted: index === highlightedIndex
      });
      displaySelectionCount += selectedValues[index] !== undefined ? 1 : 0;
    });

    return {
      displayOptions,
      displaySelectionCount
    };
  }

  render() {
    const { classes, className, selectedValues } = this.props;
    const { displayOptions, displaySelectionCount } = this.getOptions();
    return (
      <MultiSelect
        classes={{
          ...classes,
          root: className
        }}
        options={displayOptions}
        onFilterChange={this.handleFilterChange}
        onOptionClick={this.handleOptionClick}
        onCheckboxChange={this.handleCheckboxChange}
        onToggleAll={this.handleToggleAll}
        canToggleMultiple={this.props.canToggleMultiple}
        totalSelectionCount={Object.keys(selectedValues).length}
        displaySelectionCount={displaySelectionCount}
        filterText={this.state.filterText}
      />
    );
  }
}

MultiSelectContainer.propTypes = {
  /**
   * Allow select all and clear all using checkbox
   */
  canToggleMultiple: PropTypes.bool.isRequired,
  highlightable: PropTypes.bool.isRequired,
  onHighlight: PropTypes.func,
  onMultiSelect: PropTypes.func,
  onMultiClear: PropTypes.func,
  onToggle: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired
    })
  ).isRequired,
  /**
   * selected Indexes as a map
   * value 1 : selected
   * value 0 : intermediate
   */
  selectedValues: PropTypes.object.isRequired,
  highlightedIndex: PropTypes.number.isRequired
};

MultiSelectContainer.defaultProps = {
  canToggleMultiple: false,
  highlightable: false,
  highlightedIndex: -1
};

export default withStyles(styles)(MultiSelectContainer);
