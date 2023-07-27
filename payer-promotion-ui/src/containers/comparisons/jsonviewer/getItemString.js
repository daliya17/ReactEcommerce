import React from 'react';

export default (type, data, itemType, itemString) => {
  // For array type, return default which shows the no. of items in array
  if (type === 'Array') {
    return (
      <span>
        {itemType} {itemString}
      </span>
    );
  }
  // for a field, return the name of the field
  if ('name' in data && 'label' in data) {
    return (
      <span>
        <span style={{ color: 'rgb(133, 153, 0)' }}>{data.name}</span>
        {' : '}
        <span style={{ color: 'grey' }}>{data.calculatedValue}</span>
      </span>
    );
  }
  // for claim, return the claim id
  if ('chargeInfo' in data && 'fields' in data) {
    const fields = data.fields || [];
    let field;
    for (let i = 0; i < fields.length; i++) {
      field = fields[i] || {};
      if (field.name === 'patientAccountNumber')
        return <span style={{ color: 'coral' }}>{field.value}</span>;
    }
  }
  // for charge, return procedure code
  if ('fields' in data) {
    const fields = data.fields || [];
    let field;
    for (let i = 0; i < fields.length; i++) {
      field = fields[i] || {};
      if (field.name === 'procedureCode')
        return <span style={{ color: 'coral' }}>{field.value}</span>;
    }
  }
};
