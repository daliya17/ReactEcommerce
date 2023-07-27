import tv4 from 'tv4';

const diffRulesSchema = {
  title: 'Diff Rules Schema',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'number'
      },
      created: {
        type: ['string', 'number', 'null']
      },
      fieldName: {
        type: 'string'
      },
      paymentBatchId: {
        type: ['string', 'null']
      },
      payerId: {
        type: ['string', 'number', 'null']
      },
      isGlobal: {
        type: ['boolean', 'null']
      },
      notes: {
        type: ['string', 'null']
      },
      claimId: {
        type: ['string', 'null']
      },
      procedureCode: {
        type: ['string', 'null']
      }
    }
  }
};

tv4.addSchema('diffRulesSchema', diffRulesSchema);

export default {
  validate: data => tv4.validateResult(data, diffRulesSchema, true, false)
};
