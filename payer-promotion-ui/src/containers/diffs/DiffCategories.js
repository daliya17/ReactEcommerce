import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  fetchDiffCategories,
  deleteDiffCategory
} from '../../actions/diffs/categories';
import ReduxTable from '../../components/table/ReduxTable';
import Strings from '../../constants/strings.json';
import popup from '../../lib/popup';
import addable from '../../components/hoc/addable';
import AddEditDiffCategory from './AddEditDiffCategory';
import { statusLabels } from '../../constants/FieldStatuses';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  return {
    diffCategories: state.views.diffCategories
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchDiffCategories,
      deleteDiffCategory
    },
    dispatch
  );
}

class DiffCategories extends React.Component {
  state = {
    onEdit: false,
    diffCategory: undefined
  };

  componentDidMount() {
    if (this.props.diffCategories.length === 0) {
      this.props.fetchDiffCategories();
    }
  }

  getColumnDefinitions() {
    return [
      { id: 'id', label: 'id', filterable: true },
      {
        id: 'name',
        label: 'Name',
        filterable: true
      },
      {
        id: 'status',
        label: 'Assign Status',
        filterable: true,
        render: row => statusLabels[row.status] || 'Preserve Status'
      },
      { id: 'description', label: 'Description' }
    ];
  }

  getActions() {
    if (!this.actions) {
      this.actions = [
        {
          id: 'updatediffcategory',
          label: 'Update',
          selectionType: 'single',
          handler: this.handleUpdateDiffCategory
        },
        {
          id: 'deletediffcategory',
          label: 'Delete',
          selectionType: 'single',
          handler: this.handleDeleteDiffCategory
        }
      ];
    }
    return this.actions;
  }

  handleUpdateDiffCategory = indexes => {
    const index = indexes[0];
    const { diffCategories } = this.props;
    const diffCategory = diffCategories[index];

    this.setState({
      onEdit: true,
      diffCategory
    });
  };

  handleDeleteDiffCategory = indexes => {
    const index = indexes[0];
    const { diffCategories } = this.props;
    const { id, name } = diffCategories[index] || {};
    if (!id) return;

    popup.confirm('Delete the diff category ' + name + ' ?', value => {
      if (value) {
        this.props.deleteDiffCategory(id);
      }
    });
  };

  handleEditClose = () => {
    this.setState({
      onEdit: false,
      diffCategory: undefined
    });
  };

  render() {
    const { diffCategories = [] } = this.props;

    return (
      <div className="scrollable" ref={this.setScroller}>
        <ReduxTable
          name={Strings.diffCategoriesTable}
          title={'Diff Categories'}
          filterable
          actions={this.getActions()}
          columns={this.getColumnDefinitions()}
          rows={diffCategories}
          refreshable
          addable
          addComponent={addable(AddEditDiffCategory, 'Add New Category')}
          onRefresh={() => {}}
          highlightAlternateRow
        />
        {this.state.onEdit && (
          <AddEditDiffCategory
            diffCategory={this.state.diffCategory}
            onClose={this.handleEditClose}
          />
        )}
      </div>
    );
  }
}

DiffCategories.defaultProps = {
  diffCategories: []
};

DiffCategories.propTypes = {
  diffCategories: PropTypes.array.isRequired,
  fetchDiffCategories: PropTypes.func.isRequired,
  deleteDiffCategory: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiffCategories);
