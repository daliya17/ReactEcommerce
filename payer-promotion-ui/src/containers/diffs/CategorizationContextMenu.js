import {
  ClickAwayListener,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Popper,
  withStyles
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import DiffCategoriesLibrary from '../../lib/DiffCategoriesLibrary';
import DiffCategorizationOptions from './DiffCategorizationOptions';

const styles = {
  popper: {
    zIndex: 400
  },
  paper: {
    background: '#f5f5f5'
  },
  list: {
    maxHeight: '200px',
    overflow: 'auto',
    paddingTop: '0px',
    paddingBottom: '0px',
    marginBottom: '-1px'
  },
  listItem: {
    padding: '0px'
  },
  itemText: {
    padding: '8px 18px',
    '&:first-child': {
      paddingLeft: '18px'
    }
  }
};

/**
 * This component will show the options to categorize the diff
 */
class CategorizationContextMenu extends React.Component {
  state = {
    optionsOpen: false,
    diffCategoryId: undefined
  };

  handleClose = () => {
    this.setState(
      {
        optionsOpen: false
      },
      () => this.handleClickAway()
    );
  };

  handleCategorization = diffCategoryId => {
    this.setState({
      diffCategoryId,
      optionsOpen: true
    });
  };

  handleClickAway = event => {
    if (!this.state.optionsOpen) {
      this.props.onClose(event);
    }
  };

  render() {
    const { classes, anchorEl, diff } = this.props;
    const { optionsOpen } = this.state;

    return (
      <Popper
        id="diff-categorization-menu"
        className={classes.popper}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        placement="bottom"
      >
        <ClickAwayListener onClickAway={this.handleClickAway}>
          <Paper square className={classes.paper}>
            <List className={classes.list} dense>
              {DiffCategoriesLibrary.getDiffCategories()
                .filter(diffCategory => diffCategory.deleted == null)
                .map(diffCategory => (
                  <ListItem
                    key={diffCategory.id}
                    button
                    divider
                    className={classes.listItem}
                    dense
                  >
                    <ListItemText
                      onClick={() => this.handleCategorization(diffCategory.id)}
                      className={classes.itemText}
                    >
                      {diffCategory.name}
                    </ListItemText>
                  </ListItem>
                ))}
            </List>
            <Divider />
            <ListItem
              key={'clear'}
              button
              divider
              className={classes.listItem}
              dense
            >
              <ListItemText
                onClick={() => this.handleCategorization()}
                className={classes.itemText}
              >
                {'clear'}
              </ListItemText>
            </ListItem>
            {optionsOpen && (
              <DiffCategorizationOptions
                {...diff}
                onClose={this.handleClose}
                diffCategoryId={this.state.diffCategoryId}
              />
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    );
  }
}

CategorizationContextMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  anchorEl: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  diff: PropTypes.shape({
    id: PropTypes.string.isRequired,
    category: PropTypes.string,
    description: PropTypes.string,
    notes: PropTypes.string,
    claimId: PropTypes.string,
    chargeId: PropTypes.string,
    batchExceptionId: PropTypes.string,
    fieldName: PropTypes.string
  }).isRequired
};

export default withStyles(styles)(CategorizationContextMenu);
