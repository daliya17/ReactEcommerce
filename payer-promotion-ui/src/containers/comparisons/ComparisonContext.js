import React from 'react';

const ComparisonContext = React.createContext({
  regressionId: null,
  payerId: null,
  paymentBatchIdentifier: null,
  drillDownCategory: null,
  drillDownStatus: null,
  drillDownValue: null,
  drillDownDiffId: null,
  getScrollerRef: null
});

export default ComparisonContext;

export const withComparisonsMetadata = WrappedComponent => {
  const ComparisonContextConsumer = props => (
    <ComparisonContext.Consumer>
      {metadata => <WrappedComponent {...props} {...metadata} />}
    </ComparisonContext.Consumer>
  );

  return ComparisonContextConsumer;
};
