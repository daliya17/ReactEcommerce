import tv4 from 'tv4';
import FieldStatuses from '../../constants/FieldStatuses';

const fieldStatuses = [...Object.values(FieldStatuses), null];

const diffCategoriesSchema = {
  title: 'Diff Categories Schema',
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
      name: {
        type: 'string'
      },
      status: {
        enum: fieldStatuses
      },
      description: {
        type: ['string', 'null']
      },
      deleted: {
        type: ['string', 'number', 'null']
      }
    }
  }
};

tv4.addSchema('diffCategoriesSchema', diffCategoriesSchema);

export default {
  validate: data => tv4.validateResult(data, diffCategoriesSchema)
};
