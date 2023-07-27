import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Selector from '../../../lib/selectors';
import ABPDisplay from './ABPDisplay';
import ComparisonDetailsHeader from './ComparisonDetailsHeader';
import Level from './Level';
import ToggleBar from './ToggleBar';
import { withComparisonsMetadata } from '../ComparisonContext';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  const batchComparisonSelectorKey = Selector.batchComparisonSelectorKey(
    props.regressionId,
    props.payerId,
    props.paymentBatchIdentifier
  );
  const { data: comparisons = {} } = state.views.comparisons;

  return {
    comparisonResult: comparisons[batchComparisonSelectorKey] || {}
  };
}

class ComparisonDetails extends React.Component {
  static defaultProps = {};

  renderClaim = (claim, claimIndex) => {
    let similarIndexes = (claim.si || []).map(i => i + 1);
    let info =
      similarIndexes.length > 0
        ? ' same as claim at (' + similarIndexes.join(', ') + ')'
        : '';

    return (
      <React.Fragment key={claim.id + 'claim' + claimIndex}>
        <Level
          level="claim"
          id={claim.id + info}
          diffId={claim.diffId}
          fields={claim.fields}
          statistics={claim.statistics}
          keywords={claim.keywords}
          index={claimIndex}
          status={claim.stat}
        />
        {(claim.charges || []).map((charge, chargeIndex) => {
          return (
            <Level
              level="charge"
              id={charge.id}
              diffId={charge.diffId}
              key={charge.id + 'charge' + chargeIndex}
              fields={charge.fields}
              statistics={charge.statistics}
              keywords={charge.keywords}
              index={chargeIndex}
              status={charge.stat}
            />
          );
        })}
      </React.Fragment>
    );
  };

  render() {
    const { comparisonResult } = this.props;

    if (!comparisonResult || Object.keys(comparisonResult) <= 0) {
      return (
        <Typography variant="body2">{'Loading comparison details'}</Typography>
      );
    }

    return (
      <div>
        <ToggleBar />
        <div className="comparison-result">
          <ComparisonDetailsHeader />
          <ABPDisplay
            originalRemittanceText={comparisonResult.originalRemittanceText}
            generatedRemittanceText={comparisonResult.generatedRemittanceText}
          />
          <Level
            level="batch"
            fields={comparisonResult.fields}
            statistics={comparisonResult.statistics}
            keywords={comparisonResult.keywords}
          />
          {(comparisonResult.claims || []).map(this.renderClaim)}
          {(comparisonResult.batchExceptions || []).map(
            (batchException, batchExceptionIndex) => {
              return (
                <Level
                  level="batchException"
                  diffId={batchException.diffId}
                  key={
                    batchException.id + 'batchException' + batchExceptionIndex
                  }
                  id={batchException.id}
                  fields={batchException.fields}
                  statistics={batchException.statistics}
                  keywords={batchException.keywords}
                  index={batchExceptionIndex}
                  status={batchException.stat}
                />
              );
            }
          )}
        </div>
      </div>
    );
  }
}

ComparisonDetails.propTypes = {
  comparisonResult: PropTypes.object.isRequired
};

export default withComparisonsMetadata(
  connect(mapStateToProps)(ComparisonDetails)
);
