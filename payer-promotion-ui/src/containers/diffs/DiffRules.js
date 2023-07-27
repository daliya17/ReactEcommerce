import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchDiffRules, deleteDiffRule } from '../../actions/diffs/diffrules';
import ReduxTable from '../../components/table/ReduxTable';
import Strings from '../../constants/strings.json';
import Lib from '../../lib';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  return {
    diffRules: state.views.diffRules
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchDiffRules,
      deleteDiffRule
    },
    dispatch
  );
}

class DiffRulesDashboard extends React.Component {
  static defaultProps = {};

  static propTypes = {
    diffRules: PropTypes.array.isRequired,
    fetchDiffRules: PropTypes.func.isRequired,
    deleteDiffRule: PropTypes.func.isRequired
  };

  componentDidMount() {
    if (this.props.diffRules.length === 0) {
      this.props.fetchDiffRules();
    }
  }

  getColumnDefinitions() {
    return [
      { id: 'fieldName', label: 'Field', filterable: true },
      {
        id: 'isGlobal',
        label: 'Global?',
        filterable: true,
        render: this.renderIsGlobal
      },
      { id: 'payerName', label: 'Payer', filterable: true },
      { id: 'paymentBatchId', label: 'Batch', filterable: true },
      { id: 'claimId', label: 'Claim ID', filterable: true },
      { id: 'procedureCode', label: 'Procedure Code', filterable: true },
      { id: 'notes', label: 'Notes', filterable: true }
    ];
  }

  renderIsGlobal = row => {
    if (row.isGlobal) {
      return 'Y';
    }
  };

  getActions() {
    if (!this.actions) {
      this.actions = [
        {
          id: 'deletediffrule',
          label: 'Delete',
          selectionType: 'single',
          handler: this.handleDeleteDiffRule
        }
      ];
    }
    return this.actions;
  }

  handleDeleteDiffRule = indexes => {
    const index = indexes[0];
    const { diffRules } = this.props;
    const diffRuleId = Lib.getDiffRulesId(diffRules, index);
    this.props.deleteDiffRule(diffRuleId);
  };

  render() {
    const { diffRules } = this.props;

    return (
      <div className="scrollable" ref={this.setScroller}>
        <ReduxTable
          name={Strings.diffRulesTable}
          title={'Diff Rules'}
          filterable
          actions={this.getActions()}
          columns={this.getColumnDefinitions()}
          rows={diffRules}
          refreshable
          onRefresh={() => this.props.fetchDiffRules()}
          highlightAlternateRow
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiffRulesDashboard);
