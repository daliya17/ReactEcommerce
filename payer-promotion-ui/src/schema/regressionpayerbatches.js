import tv4 from 'tv4';
import ScoreFields from './scorefields';
import remitAdviceFormat from '../constants/RemitAdviceFormat';

export const batchStatuses = ['SKIPPED', 'RUNNING', 'ERROR', 'FINISHED'];

export const postingStatus = [
  'INITIATED',
  'IGNORED',
  'ERROR',
  'OLDIMPORTFAILED',
  'NEWIMPORTFAILED',
  'INPROGRESS',
  'COMPLETED',
  null
];

const regressionPayerBatchesSchema = {
  title: 'Regression Payers Schema',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      regressionDataId: {
        type: 'number'
      },
      postingStatus: {
        enum: postingStatus
      },
      batchId: {
        type: 'number'
      },
      contextId: {
        type: 'number'
      },
      layoutId: {
        type: ['string', 'null']
      },
      ...ScoreFields,
      totalFields: {
        type: ['number', 'null']
      },
      matchedFields: {
        type: ['number', 'null']
      },
      addedFields: {
        type: ['number', 'null']
      },
      removedFields: {
        type: ['number', 'null']
      },
      differentFields: {
        type: ['number', 'null']
      },
      blankFields: {
        type: ['number', 'null']
      },
      ignoredFields: {
        type: ['number', 'null']
      },
      regressionBatchStatus: {
        enum: batchStatuses
      },
      remitType: {
        type: ['string', 'null']
      },
      status: {
        type: ['string', 'null']
      },
      errorReason: {
        type: ['string', 'null']
      },
      sentToPostingDate: {
        type: ['string', 'number', 'null']
      },
      remitAdviceFormat: {
        enum: [...Object.values(remitAdviceFormat), null]
      },
      notes: {
        type: ['string', 'null']
      }
    }
  }
};

tv4.addSchema('regressionPayerBatchesSchema', regressionPayerBatchesSchema);

export default {
  validate: data =>
    tv4.validateResult(data, regressionPayerBatchesSchema, true, false)
};
