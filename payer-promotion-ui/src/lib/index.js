import { findDOMNode } from 'react-dom';
import { isNumber } from 'util';
import { groupBy } from 'lodash';
import FieldStatuses from '../constants/FieldStatuses';
import { remitAdviceFormatLabels } from '../constants/RemitAdviceFormat';
import Selector from './selectors';

function getPayerIndex(payers, payerId) {
  for (let i = 0; i < payers.length; i++) {
    // eslint-disable-next-line eqeqeq
    if (payers[i].payerId == payerId) {
      return i;
    }
  }
  return -1;
}

function getPayerId(payers, payerIndex) {
  const payer = payers[payerIndex];
  if (payer && payer.payerId) return payer.payerId;
  return -1;
}

function getRegressionIndex(regressions, regressionId) {
  for (let i = 0; i < regressions.length; i++) {
    // eslint-disable-next-line eqeqeq
    if (regressions[i].id == regressionId) {
      return i;
    }
  }
  return -1;
}

function getRegressionId(regressions, regressionIndex) {
  const regression = regressions[regressionIndex];
  if (regression && regression.id) return regression.id;
  return -1;
}

function getDiffRulesId(diffRules, diffRuleIndex) {
  const diffRule = diffRules[diffRuleIndex];
  if (diffRule && diffRule.id) return diffRule.id;
  return -1;
}

function getBatchIdentifier(batches, batchIndex) {
  const batch = batches[batchIndex];
  return getPaymentBatchIdentifier(batch);
}

function getPaymentBatchIdentifier(batch) {
  if (batch && batch.paymentBatchIdentifier) {
    return batch.paymentBatchIdentifier;
  }
  if (batch && batch.batchId && batch.contextId) {
    return batch.batchId + 'A' + batch.contextId;
  }
  return '';
}

function getPayerBatchesOptions(payerBatches) {
  if (payerBatches) {
    // Sort payment batches by created desc
    return payerBatches.sort((a, b) => b.created - a.created).map(pb => {
      const pbId = pb.batchId + 'A' + pb.contextId;
      return {
        label: pbId,
        value: pbId
      };
    });
  }
}

function getBatchIndex(batches, paymentBatchIdentifier) {
  const matches = (paymentBatchIdentifier || '').match(
    /^\s*(\d+)[Aa](\d+)\s*$/
  );
  if (matches) {
    const batchId = matches[1],
      contextId = matches[2];
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      // eslint-disable-next-line eqeqeq
      if (batch.batchId == batchId && batch.contextId == contextId) {
        return i;
      }
    }
  }
  return -1;
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function toDateString(timestamp) {
  if (isNumber(timestamp)) {
    try {
      var date = new Date(timestamp);
      return (
        date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()
      );
    } catch (e) {
      /* do nothing */
    }
  }
  return timestamp || '';
}

/**
 *
 * @param {*} uservalue
 * @returns list of parsed batch list and first invalid input
 */
function parsePaymentBatchList(uservalue) {
  let invalidText = '';
  let paymentBatchList = [];
  if (uservalue.includes(',')) {
    paymentBatchList = uservalue.split(',');
  } else if (uservalue.includes('\n')) {
    paymentBatchList = uservalue.split('\n');
  } else {
    paymentBatchList = [uservalue];
  }

  if (paymentBatchList.length === 0) {
    return {
      invalidText,
      batchList: paymentBatchList
    };
  }

  let paymentBatchListValues = [];
  for (let index = 0; index < paymentBatchList.length; index++) {
    const element = paymentBatchList[index];
    if (element) {
      let batchContext = element.match(/^(\d+)A(\d+)$/);
      if (batchContext) {
        paymentBatchListValues.push({
          batchId: batchContext[1],
          contextId: batchContext[2]
        });
      } else {
        invalidText = element;
        break;
      }
    }
  }
  return {
    invalidText,
    batchList: paymentBatchListValues
  };
}

function scrollIntoView(scrollable, scrollTo) {
  if (scrollable && scrollTo) {
    let scrollOffset = scrollTo.offsetTop;
    if (!scrollOffset) {
      const element = findDOMNode(scrollTo);
      if (element) {
        scrollOffset = element.offsetTop;
      }
    }

    if (scrollOffset && scrollable.scrollTo) {
      // Skip if the element is already in the view
      const displayTop = scrollable.scrollTop;
      const displayBottom = displayTop + scrollable.offsetHeight;
      if (scrollOffset < displayTop || scrollOffset > displayBottom) {
        scrollable.scrollTo(0, scrollOffset);
      }
    }
  }
}

function getFieldsStatistics(fields) {
  let total = 0,
    matched = 0,
    added = 0,
    different = 0,
    removed = 0;
  fields.forEach(field => {
    switch (field.stat) {
      case FieldStatuses.Matched:
        matched++;
        total++;
        break;
      case FieldStatuses.Added:
        added++;
        total++;
        break;
      case FieldStatuses.Different:
        different++;
        total++;
        break;
      case FieldStatuses.Removed:
        removed++;
        total++;
        break;
      default:
        break;
    }
  });

  return {
    total,
    matched,
    added,
    different,
    removed,
    matchedp: percent(matched, total),
    addedp: percent(added, total),
    differentp: percent(different, total),
    removedp: percent(removed, total)
  };
}

function percent(count, total) {
  return (total === 0 ? 0 : (count / total) * 100).toFixed(2) + ' %';
}

function fieldDisplayName(text, level) {
  let displayName = (text || '').replace(/[_]/g, ' ');
  if (level) {
    level = level.toUpperCase();
    level = level === 'CHARGE' ? 'DETAIL' : level;
    const regex = new RegExp('^' + level + ' ');
    displayName = displayName.replace(regex, '');
  }
  return displayName;
}

function calculateScore(item) {
  item.matchedPercentage = Number(item.matchedPercentage)
    ? item.matchedPercentage.toFixed(2)
    : item.matchedPercentage;
  item.addedPercentage = Number(item.addedPercentage)
    ? item.addedPercentage.toFixed(2)
    : item.addedPercentage;
  item.differentPercentage = Number(item.differentPercentage)
    ? item.differentPercentage.toFixed(2)
    : item.differentPercentage;
  item.removedPercentage = Number(item.removedPercentage)
    ? item.removedPercentage.toFixed(2)
    : item.removedPercentage;
  item.blankPercentage = Number(item.blankPercentage)
    ? item.blankPercentage.toFixed(2)
    : item.blankPercentage;
  item.ignoredPercentage = Number(item.ignoredPercentage)
    ? item.ignoredPercentage.toFixed(2)
    : item.ignoredPercentage;

  item.score = Number(item.score) ? item.score.toFixed(2) : item.score;
}

function getRegressionDiffSelector(
  regressionId,
  categoryId,
  fieldName,
  status
) {
  const items = [regressionId];
  if (categoryId) items.push(categoryId);
  if (fieldName) items.push(fieldName);
  if (status) items.push(status);

  return items.join(':');
}

function parseContentByFormat(content) {
  return groupBy(content, 'remitAdviceFormat');
}

function getRegressionFormatPayerBatchCount(payers) {
  const formatBatchCount = {};
  Object.keys(remitAdviceFormatLabels).forEach(format => {
    formatBatchCount[remitAdviceFormatLabels[format]] = 0;
  });
  Object.keys(payers).forEach(format => {
    const payerList = payers[format];
    payerList.forEach(payer => {
      formatBatchCount[remitAdviceFormatLabels[format]] =
        formatBatchCount[remitAdviceFormatLabels[format]] + payer.totalBatches;
    });
  });

  return formatBatchCount;
}

function getRegressionFormatBatchCount(batches) {
  const formatBatchCount = {};
  Object.keys(remitAdviceFormatLabels).forEach(format => {
    formatBatchCount[remitAdviceFormatLabels[format]] = 0;
  });
  Object.keys(batches).forEach(format => {
    formatBatchCount[remitAdviceFormatLabels[format]] =
      formatBatchCount[remitAdviceFormatLabels[format]] +
      batches[format].length;
  });

  return formatBatchCount;
}

function getFormatLabels(formatBatchCount) {
  var formatLabels = {};
  Object.keys(formatBatchCount).forEach(format => {
    formatLabels[format] =
      format + ' | ' + formatBatchCount[format] + ' Batches';
  });

  return formatLabels;
}

function getPayerList(payers) {
  var payerList = [];
  const groupByPayer = groupBy(payers, 'payerId');
  const ignoreKeys = ['totalBatches', 'completedBatches', 'remitAdviceFormat'];
  Object.keys(groupByPayer).forEach(payerId => {
    var payerDetails = {};
    var formatList = groupByPayer[payerId];
    Object.keys(remitAdviceFormatLabels).forEach(format => {
      payerDetails[remitAdviceFormatLabels[format] + 'BatchPresent'] = 'N';
    });
    formatList.forEach(payer => {
      Object.keys(payer).forEach(key => {
        if (!ignoreKeys.includes(key)) {
          payerDetails[key] = payer[key];
        }
      });
      payerDetails[
        remitAdviceFormatLabels[payer['remitAdviceFormat']] + 'BatchPresent'
      ] = 'Y';
    });
    payerList.push(payerDetails);
  });

  payerList.sort(function(a, b) {
    return a.payerId - b.payerId;
  });

  return payerList;
}

function getFormatByIndex(index, expected) {
  var actual = remitAdviceFormatLabels['null'];
  switch (index) {
    case 0:
      actual = remitAdviceFormatLabels['ANSI835'];
      break;

    case 1:
      actual = remitAdviceFormatLabels['JSON'];
      break;

    default:
      actual = remitAdviceFormatLabels['null'];
      break;
  }

  return actual === expected;
}

function getSelectedRegressionData(
  batches,
  selectedBatchFormatTabIndex,
  selectedIndexes
) {
  const batchList = Selector.getSelectedTypeByFormat(
    batches,
    selectedBatchFormatTabIndex
  );

  const regressionDataIds = batchList
    .filter((batch, batchIndex) => {
      return selectedIndexes.indexOf(batchIndex.toString()) !== -1;
    })
    .map(batch => {
      return batch.regressionDataId;
    });

  return regressionDataIds;
}

export default {
  getPayerIndex,
  parsePaymentBatchList,
  getPayerId,
  getRegressionIndex,
  getRegressionId,
  getBatchIdentifier,
  getPaymentBatchIdentifier,
  getBatchIndex,
  randomIntFromInterval,
  toDateString,
  scrollIntoView,
  getFieldsStatistics,
  fieldDisplayName,
  getPayerBatchesOptions,
  calculateScore,
  percent,
  getDiffRulesId,
  getRegressionDiffSelector,
  parseContentByFormat,
  getRegressionFormatPayerBatchCount,
  getRegressionFormatBatchCount,
  getFormatLabels,
  getPayerList,
  getFormatByIndex,
  getSelectedRegressionData
};
