import { Button, withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { resetPayerSelection } from '../actions/payers';
import { resetRegressionSelection } from '../actions/regressions';
import Strings from '../constants/strings.json';
import Path from '../lib/path';
import PropTypes from 'prop-types';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  return {};
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      resetPayerSelection,
      resetRegressionSelection
    },
    dispatch
  );
}

const styles = {
  marginLeft: {
    marginLeft: '50px'
  },
  button: {
    color: '#c8c8c8'
  },
  selected: {
    color: 'white'
  },
  toolbar: {
    minHeight: '56px'
  }
};

class ApplicationBar extends React.Component {
  static defaultProps = {};

  static propTypes = {};

  state = {
    isRegressionsRoute: Path.isRegressionsRoute(),
    isDiffRulesRoute: Path.isDiffRulesRoute(),
    isPayersRoute: Path.isPayersRoute(),
    isDiffCategoriesRoute: Path.isDiffCategoriesRoute(),
    isDiffCategorizationRulesRoute: Path.isDiffCategorizationRulesRoute()
  };

  handleRoute = route => {
    let changes = {
      isRegressionsRoute: false,
      isDiffRulesRoute: false,
      isPayersRoute: false,
      isDiffCategoriesRoute: false,
      isDiffCategorizationRulesRoute: false
    };
    if (route === 'payers') {
      this.props.resetPayerSelection();
      changes = {
        ...changes,
        isPayersRoute: true
      };
    } else if (route === 'regressions') {
      this.props.resetRegressionSelection();
      changes = {
        ...changes,
        isRegressionsRoute: true
      };
    } else if (route === 'diffrules') {
      changes = {
        ...changes,
        isDiffRulesRoute: true
      };
    } else if (route === 'diffcategories') {
      changes = {
        ...changes,
        isDiffCategoriesRoute: true
      };
    } else if (route === 'diffcategorizationrules') {
      changes = {
        ...changes,
        isDiffCategorizationRulesRoute: true
      };
    }

    this.setState(changes);
  };

  render() {
    const { classes } = this.props;

    return (
      <AppBar position="relative" color="primary">
        <Toolbar className={classes.toolbar}>
          <Typography variant="title" color="inherit">
            {Strings.appName}
          </Typography>

          <Link to={Path.PayersRoute} className="link">
            <Button
              variant="text"
              color="inherit"
              className={classNames(classes.marginLeft, classes.button, {
                [classes.selected]: this.state.isPayersRoute
              })}
              onClick={() => this.handleRoute('payers')}
            >
              {'Payers'}
            </Button>
          </Link>
          <Link to={Path.RegressionsRoute} className="link">
            <Button
              variant="text"
              color="inherit"
              className={classNames(classes.button, {
                [classes.selected]: this.state.isRegressionsRoute
              })}
              onClick={() => this.handleRoute('regressions')}
            >
              {'Regressions'}
            </Button>
          </Link>
          <Link to={Path.DiffRulesRoute} className="link">
            <Button
              variant="text"
              color="inherit"
              className={classNames(classes.button, {
                [classes.selected]: this.state.isDiffRulesRoute
              })}
              onClick={() => this.handleRoute('diffrules')}
            >
              {'Diff Rules'}
            </Button>
          </Link>
          <Link to={Path.DiffCategoriesRoute} className="link">
            <Button
              variant="text"
              color="inherit"
              className={classNames(classes.button, {
                [classes.selected]: this.state.isDiffCategoriesRoute
              })}
              onClick={() => this.handleRoute('diffcategories')}
            >
              {'Diff Categories'}
            </Button>
          </Link>
          <Link to={Path.DiffCategorizationRulesRoute} className="link">
            <Button
              variant="text"
              color="inherit"
              className={classNames(classes.button, {
                [classes.selected]: this.state.isDiffCategorizationRulesRoute
              })}
              onClick={() => this.handleRoute('diffcategorizationrules')}
            >
              {'Bulk Diff Categorizations'}
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    );
  }
}

ApplicationBar.propTypes = {
  classes: PropTypes.object.isRequired,
  resetPayerSelection: PropTypes.func.isRequired,
  resetRegressionSelection: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ApplicationBar));
