import tv4 from 'tv4';
import ScoreFields from './scorefields';

const regressionsSchema = {
  title: 'Regressions Schema',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'number'
      },
      name: {
        type: ['string', 'null']
      },
      created: {
        type: ['number', 'string', 'null']
      },
      createdBy: {
        type: ['string', 'null']
      },
      type: {
        type: ['string', 'null']
      },
      reasonCode: {
        type: ['string', 'null']
      },
      ...ScoreFields
    }
  }
};

tv4.addSchema('regressionsSchema', regressionsSchema);

export default {
  validate: data => tv4.validateResult(data, regressionsSchema, true, false)
};
