import tv4 from 'tv4';
import FieldStatuses from '../constants/FieldStatuses';

const evalSchema = {
  title: 'Evaluation Schema',
  type: 'object',
  properties: {
    id: {
      type: ['string', 'null']
    },
    type: {
      type: ['string', 'null']
    },
    act: {
      type: ['string', 'null']
    },
    ov: {
      type: ['string', 'null']
    },
    nv: {
      type: ['string', 'null']
    },
    sf: {
      type: ['string', 'null']
    }
  }
};

const fieldStatuses = [...Object.values(FieldStatuses), null];
const levelStatuses = [
  FieldStatuses.Matched,
  FieldStatuses.Added,
  FieldStatuses.Removed,
  null
];

const fieldSchema = {
  title: 'Field Schema',
  type: 'object',
  properties: {
    id: {
      type: ['string', 'null']
    },
    stat: {
      enum: fieldStatuses
    },
    evals: {
      type: 'array',
      items: {
        $ref: 'evalSchema'
      }
    },
    ov: {
      type: ['string', 'null']
    },
    gv: {
      type: ['string', 'null']
    },
    av: {
      type: ['string', 'null']
    },
    sf: {
      type: ['string', 'null']
    },
    ignoreRuleId: {
      type: ['number', 'null']
    }
  }
};

const chargeSchema = {
  title: 'Charge Schema',
  type: 'object',
  properties: {
    fields: {
      type: 'array',
      items: {
        $ref: 'fieldSchema'
      }
    },
    evals: {
      type: 'array',
      items: {
        $ref: 'evalSchema'
      }
    },
    id: {
      type: ['string', 'null']
    },
    stat: {
      enum: levelStatuses
    }
  }
};

const claimSchema = {
  title: 'Claim Schema',
  type: 'object',
  properties: {
    fields: {
      type: 'array',
      items: {
        $ref: 'fieldSchema'
      }
    },
    evals: {
      type: 'array',
      items: {
        $ref: 'evalSchema'
      }
    },
    id: {
      type: ['string', 'null']
    },
    stat: {
      enum: levelStatuses
    },
    charges: {
      type: 'array',
      items: {
        $ref: 'chargeSchema'
      }
    },
    // similar indexes
    si: {
      type: 'array',
      items: {
        type: ['number']
      }
    }
  }
};

const batchExceptionSchema = {
  title: 'Batch Exception Schema',
  type: 'object',
  properties: {
    fields: {
      type: 'array',
      items: {
        $ref: 'fieldSchema'
      }
    },
    evals: {
      type: 'array',
      items: {
        $ref: 'evalSchema'
      }
    },
    id: {
      type: ['string', 'null']
    },
    stat: {
      enum: levelStatuses
    }
  }
};

const batchSchema = {
  title: 'batch schema',
  type: 'object',
  properties: {
    fields: {
      type: 'array',
      items: {
        $ref: 'fieldSchema'
      }
    },
    claims: {
      type: 'array',
      items: {
        $ref: 'claimSchema'
      }
    },
    batchExceptions: {
      type: 'array',
      items: {
        $ref: 'batchExceptionSchema'
      }
    },
    evals: {
      type: 'array',
      items: {
        $ref: 'evalSchema'
      }
    },
    id: {
      type: ['string', 'null']
    },
    stat: {
      type: ['string', 'null']
    },
    originalRemittanceText: {
      type: ['string', 'null']
    },
    generatedRemittanceText: {
      type: ['string', 'null']
    },
    totalFieldsCount: {
      type: ['number', 'null']
    },
    matchedFieldsCount: {
      type: ['number', 'null']
    }
  }
};

tv4.addSchema('evalSchema', evalSchema);
tv4.addSchema('fieldSchema', fieldSchema);
tv4.addSchema('chargeSchema', chargeSchema);
tv4.addSchema('claimSchema', claimSchema);
tv4.addSchema('batchExceptionSchema', batchExceptionSchema);
tv4.addSchema('batchSchema', batchSchema);

export default {
  validate: data => tv4.validateResult(data, batchSchema, true, false)
};
