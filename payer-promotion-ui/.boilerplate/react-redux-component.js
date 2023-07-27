import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ActionCreators from '../actions';
import Lib from '../lib';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  return {
    ...state,
    ...props
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

class ComponentName extends React.Component {
  static defaultProps = {};

  static propTypes = {};

  constructor(props) {
    super(props);
  }

  render() {
    return <div />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentName);
