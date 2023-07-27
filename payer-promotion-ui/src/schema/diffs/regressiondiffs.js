import tv4 from 'tv4';
import FieldStatuses from '../../constants/FieldStatuses';

const fieldStatuses = [...Object.values(FieldStatuses), null];

const regressionDiffsSchema = {
  title: 'Regression Diffs Schema',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'string'
      },
      batch: {
        type: 'string'
      },
      payerId: {
        type: ['number', 'null']
      },
      categoryId: {
        type: ['number', 'null']
      },
      ruleId: {
        type: ['number', 'null']
      },
      status: {
        enum: fieldStatuses
      },
      claimId: {
        type: ['string', 'null']
      },
      chargeId: {
        type: ['string', 'null']
      },
      batchExceptionId: {
        type: ['string', 'null']
      },
      fieldName: {
        type: ['string', 'null']
      },
      notes: {
        type: ['string', 'null']
      }
    }
  }
};

tv4.addSchema('regressionDiffsSchema', regressionDiffsSchema);

export default {
  validate: data => tv4.validateResult(data, regressionDiffsSchema)
};
