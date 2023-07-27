import React from 'react';
import CategorizationContextMenu from './CategorizationContextMenu';

/**
 * This is higher order component that will help in binding the
 * categorization menu to a diff component
 */
const diffCategorizable = WrappedComponent => {
  class DiffCategorizerContextMenuProvider extends React.Component {
    state = {
      isOpen: false,
      target: undefined,
      diff: undefined
    };

    contextMenuHandler = diff => {
      if (diff) {
        return event => {
          if (event.preventDefault) event.preventDefault();
          if (event.stopPropagation) event.stopPropagation();

          const target = event.currentTarget;
          setTimeout(() => {
            this.setState({
              isOpen: true,
              target,
              diff
            });
          }, 10);
        };
      }
    };

    handleMenuClose = event => {
      if (event) {
        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
      }

      this.setState({
        isOpen: false,
        target: undefined,
        diff: undefined
      });
    };

    render() {
      const { isOpen, target, diff } = this.state;
      return (
        <React.Fragment>
          <WrappedComponent
            {...this.props}
            contextMenuHandler={this.contextMenuHandler}
          />
          {isOpen && (
            <CategorizationContextMenu
              anchorEl={target}
              onClose={this.handleMenuClose}
              diff={diff}
            />
          )}
        </React.Fragment>
      );
    }
  }

  return DiffCategorizerContextMenuProvider;
};

export default diffCategorizable;
