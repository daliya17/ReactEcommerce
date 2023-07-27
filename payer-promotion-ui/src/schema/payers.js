import tv4 from 'tv4';

const payersSchema = {
  title: 'Payers Schema',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'number'
      },
      payerId: {
        type: 'number'
      },
      payerName: {
        type: 'string'
      },
      promoted: {
        type: ['number', 'string', 'null']
      }
    }
  }
};

tv4.addSchema('payerSchema', payersSchema);

export default {
  validate: data => tv4.validateResult(data, payersSchema, true, false)
};
