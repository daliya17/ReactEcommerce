import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReduxTable from '../../components/table/ReduxTable';
import Strings from '../../constants/strings.json';
import {
  fetchDiffCategorizationRules,
  deleteDiffCategorizationRule
} from '../../actions/diffs/categorizationrules';
import { displayDate } from '../../components/displayDate';
import popup from '../../lib/popup';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  return {
    diffCategorizationRules: state.views.diffCategorizationRules || []
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchDiffCategorizationRules,
      deleteDiffCategorizationRule
    },
    dispatch
  );
}

/**
 * This component is used to manage the diff categorization rules
 * i.e to list the rules and delete a rule
 * In UI, this is named as Bulk Diff Categorizations
 */
class DiffCategorizationRules extends React.Component {
  getColumnDefinitions() {
    if (!this.columns) {
      this.columns = [
        { id: 'fieldName', label: 'Field', filterable: true },
        {
          id: 'isGlobal',
          label: 'Global?',
          filterable: true,
          render: this.renderIsGlobal
        },
        { id: 'payerName', label: 'Payer', filterable: true },
        { id: 'diffCategoryName', label: 'Diff Category', filterable: true },
        {
          id: 'created',
          label: 'Created',
          render: row => displayDate(row.created)
        },
        { id: 'notes', label: 'Notes', filterable: true }
      ];
    }

    return this.columns;
  }

  getActions() {
    if (!this.actions) {
      this.actions = [
        {
          id: 'deletecategorization',
          label: 'Delete',
          selectionType: 'single',
          handler: this.handleDeleteCategorization
        }
      ];
    }

    return this.actions;
  }

  handleDeleteCategorization = indexes => {
    const index = indexes[0];
    const { diffCategorizationRules } = this.props;
    const { id, fieldName } = diffCategorizationRules[index] || {};

    if (!id) return;

    popup.confirm(
      'Delete the categorization for field ' + fieldName + '?',
      value => {
        if (value) {
          this.props.deleteDiffCategorizationRule(id);
        }
      }
    );
  };

  renderIsGlobal = row => {
    if (row.isGlobal) {
      return 'Y';
    }
  };

  render() {
    const { diffCategorizationRules } = this.props;

    return (
      <div className="scrollable">
        <ReduxTable
          name={Strings.diffCategorizationRulesTable}
          title={'Bulk Diff Categorizations'}
          filterable
          actions={this.getActions()}
          columns={this.getColumnDefinitions()}
          rows={diffCategorizationRules}
          refreshable
          onRefresh={() => this.props.fetchDiffCategorizationRules()}
          highlightAlternateRow
        />
      </div>
    );
  }
}

DiffCategorizationRules.defaultProps = {
  diffCategorizationRules: []
};

DiffCategorizationRules.propTypes = {
  diffCategorizationRules: PropTypes.array.isRequired,
  fetchDiffCategorizationRules: PropTypes.func.isRequired,
  deleteDiffCategorizationRule: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiffCategorizationRules);
