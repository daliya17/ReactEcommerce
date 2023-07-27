import tv4 from 'tv4';

const diffCategorizationRulesSchema = {
  title: 'Diff Categorization Rules Schema',
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
      payerId: {
        type: ['string', 'number', 'null']
      },
      isGlobal: {
        type: ['boolean', 'null']
      },
      notes: {
        type: ['string', 'null']
      },
      diffCategoryId: {
        type: 'number'
      },
      deleted: {
        type: ['string', 'number', 'null']
      }
    }
  }
};

tv4.addSchema('diffCategorizationRulesSchema', diffCategorizationRulesSchema);

export default {
  validate: data =>
    tv4.validateResult(data, diffCategorizationRulesSchema, true, false)
};
