import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { fetchPayers } from '../actions/payers';
import {
  RegressionStartRangeOptions,
  fetchRegressions
} from '../actions/regressions';
import { fetchDiffRules } from '../actions/diffs/diffrules';
import { fetchDiffCategories } from '../actions/diffs/categories';
import Alerts from '../components/Alerts';
import ErrorBoundary from '../components/error-boundary';
import Loader from '../components/loader';
import Appbar from './AppBar';
import ViewResolver from './ViewResolver';
import Redirector from '../components/redirector';
import Path from '../lib/path';
import JsonViewer from './comparisons/jsonviewer';

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
      fetchPayers,
      fetchRegressions,
      fetchDiffRules,
      fetchDiffCategories
    },
    dispatch
  );
}

class App extends React.Component {
  componentDidMount() {
    if (!Path.isJsonRoute()) {
      this.props.fetchPayers();
      this.props.fetchRegressions(RegressionStartRangeOptions[0].value);
      this.props.fetchDiffRules();
      this.props.fetchDiffCategories(true);
    }
  }

  renderRouter() {
    if (Path.isJsonRoute()) {
      return <JsonViewer />;
    }

    return (
      <Router basename={process.env.PUBLIC_URL}>
        <React.Fragment>
          <Appbar />
          <main>
            <ViewResolver />
          </main>
          <Redirector />
        </React.Fragment>
      </Router>
    );
  }

  render() {
    return (
      <ErrorBoundary>
        {this.renderRouter()}
        <Alerts />
        <Loader />
      </ErrorBoundary>
    );
  }
}

App.propTypes = {
  fetchPayers: PropTypes.func.isRequired,
  fetchRegressions: PropTypes.func.isRequired,
  fetchDiffRules: PropTypes.func.isRequired,
  fetchDiffCategories: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
