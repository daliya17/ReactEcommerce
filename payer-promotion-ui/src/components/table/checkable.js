import React from 'react';
import { cloneDeep } from 'lodash';

export default WrappedComponent => {
  class PersistSelection extends React.Component {
    state = {
      checkedIndexes: {}
    };

    componentWillReceiveProps(nextProps) {
      if (this.props.rows !== nextProps.rows) {
        this.setState({
          checkedIndexes: {}
        });
      }
    }

    handleCheckboxChange = index => {
      this.setState(prevState => {
        const checkedIndexes = cloneDeep(prevState.checkedIndexes);
        if (checkedIndexes[index]) {
          delete checkedIndexes[index];
        } else {
          checkedIndexes[index] = true;
        }

        return {
          checkedIndexes
        };
      });
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          checkedIndexes={this.state.checkedIndexes}
          onCheckboxChange={this.handleCheckboxChange}
        />
      );
    }
  }

  return PersistSelection;
};
