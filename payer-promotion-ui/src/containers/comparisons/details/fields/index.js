import PropTypes from 'prop-types';
import React from 'react';
import Field from './Field';

const Fields = props => {
  const { fields, level } = props;

  return (
    <table className="diff-table">
      <thead>
        <tr>
          <th className="nopadding original-status-cell" />
          <th className="name-cell">Field</th>
          <th>As Is Value</th>
          <th>Original ABP</th>
          <th>Generated ABP</th>
          <th>Diff Category</th>
          <th>Rules</th>
        </tr>
      </thead>
      <tbody>
        {fields.map(field => (
          <Field key={field.id} field={field} level={level} />
        ))}
      </tbody>
    </table>
  );
};

Fields.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      ov: PropTypes.string,
      gv: PropTypes.string,
      av: PropTypes.string,
      stat: PropTypes.string,
      evals: PropTypes.array.isRequired,
      ignoreRuleId: PropTypes.number,
      diffId: PropTypes.string
    })
  ),
  level: PropTypes.string.isRequired
};

export default Fields;
