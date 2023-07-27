import tv4 from 'tv4';
import ScoreFields from './scorefields';
import remitAdviceFormat from '../constants/RemitAdviceFormat';

const regressionPayersSchema = {
  title: 'Regression Payers Schema',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      payerId: {
        type: 'number'
      },
      payerName: {
        type: ['string', 'null']
      },
      totalBatches: {
        type: ['number', 'null']
      },
      completedBatches: {
        type: ['number', 'null']
      },
      remitAdviceFormat: {
        enum: [...Object.values(remitAdviceFormat), null]
      },
      ...ScoreFields
    }
  }
};

tv4.addSchema('regressionPayersSchema', regressionPayersSchema);

export default {
  validate: data =>
    tv4.validateResult(data, regressionPayersSchema, true, false)
};
