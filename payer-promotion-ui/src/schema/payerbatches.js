import tv4 from 'tv4';

const payerBatchesSchema = {
  title: 'Payer Batches Schema',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'number'
      },
      batchId: {
        type: 'number'
      },
      contextId: {
        type: 'number'
      },
      remitType: {
        type: ['string', 'null']
      },
      created: {
        type: ['string', 'number', 'null']
      },
      createdBy: {
        type: ['string', 'null']
      }
    }
  }
};

tv4.addSchema('payerBatchesSchema', payerBatchesSchema);

export default {
  validate: data => tv4.validateResult(data, payerBatchesSchema, true, false)
};
