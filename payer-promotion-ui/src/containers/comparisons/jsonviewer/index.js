import PropTypes from 'prop-types';
import React from 'react';
import ReactJsonView from 'react-json-tree';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchBatchAsIsJson } from '../../../actions/comparisons';
import Path from '../../../lib/path';
import { Typography, FormControlLabel, Switch } from '@material-ui/core';
import getItemString from './getItemString';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  return {
    asIsJson: state.views.asIsJson,
    regressionId: Number(Path.getSelectedRegression()),
    paymentBatchIdentifier: Path.getSelectedRegressionPayerBatch()
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchBatchAsIsJson
    },
    dispatch
  );
}

class JsonViewer extends React.Component {
  static defaultProps = {};

  static propTypes = {
    asIsJson: PropTypes.object,
    paymentBatchIdentifier: PropTypes.string.isRequired,
    regressionId: PropTypes.number.isRequired,
    fetchBatchAsIsJson: PropTypes.func.isRequired
  };

  defaultExpandedNodes = {
    batchInfo: 1,
    claimInfo: 1
  };

  state = {
    expandCollapse: {
      claimInfo: false,
      chargeInfo: false,
      claimFields: false,
      chargeFields: false
    },
    rawJson: false
  };

  componentDidMount() {
    if (!this.props.asIsJson) {
      this.props.fetchBatchAsIsJson(
        this.props.regressionId,
        this.props.paymentBatchIdentifier
      );
    }
  }

  handleExpandCollapse = key => () => {
    this.setState(prevState => ({
      expandCollapse: {
        ...prevState.expandCollapse,
        [key]: !prevState.expandCollapse[key]
      }
    }));
  };

  handleRawJsonSwitch = () => {
    this.setState(prevState => ({
      rawJson: !prevState.rawJson
    }));
  };

  renderSwitch = (label, checked, handler) => {
    return (
      <FormControlLabel
        label={label}
        control={
          <Switch checked={checked} onChange={handler} color="secondary" />
        }
      />
    );
  };

  render() {
    const { asIsJson } = this.props;
    const { expandCollapse, rawJson } = this.state;

    if (!asIsJson) {
      return <Typography>{'No JSON found'}</Typography>;
    }

    return (
      <div className="json-viewer">
        <div>
          {this.renderSwitch('Raw Json', rawJson, this.handleRawJsonSwitch)}
          {!rawJson && (
            <React.Fragment>
              {this.renderSwitch(
                'Expand all claims',
                expandCollapse.claimInfo,
                this.handleExpandCollapse('claimInfo')
              )}
              {expandCollapse.claimInfo &&
                this.renderSwitch(
                  'Expand claim fields',
                  expandCollapse.claimFields,
                  this.handleExpandCollapse('claimFields')
                )}
              {expandCollapse.claimInfo &&
                this.renderSwitch(
                  'Expand all charges',
                  expandCollapse.chargeInfo,
                  this.handleExpandCollapse('chargeInfo')
                )}
              {expandCollapse.claimInfo &&
                expandCollapse.chargeInfo &&
                this.renderSwitch(
                  'Expand charge fields',
                  expandCollapse.chargeFields,
                  this.handleExpandCollapse('chargeFields')
                )}
            </React.Fragment>
          )}
        </div>
        {rawJson && (
          <pre>
            <code>{JSON.stringify(asIsJson, null, 4)}</code>
          </pre>
        )}
        {!rawJson && (
          <ReactJsonView
            data={asIsJson}
            keyPath={['batchInfo']}
            invertTheme={false}
            shouldExpandNode={keyNames => {
              if (this.defaultExpandedNodes[keyNames[0]]) return true;
              if (expandCollapse.claimInfo) {
                if (keyNames[1] === 'claimInfo') return true;
                if (
                  expandCollapse.claimFields &&
                  keyNames[2] === 'claimInfo' &&
                  keyNames[0] === 'fields'
                )
                  return true;

                if (expandCollapse.chargeInfo) {
                  if (
                    keyNames[0] === 'chargeInfo' ||
                    keyNames[1] === 'chargeInfo'
                  )
                    return true;
                  if (
                    expandCollapse.chargeFields &&
                    keyNames[2] === 'chargeInfo'
                  ) {
                    return true;
                  }
                }
              }

              return false;
            }}
            getItemString={getItemString}
          />
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JsonViewer);
