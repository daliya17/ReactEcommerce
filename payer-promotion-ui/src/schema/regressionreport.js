import tv4 from 'tv4';

const regressionReportSchema = {};

export default {
  validate: data =>
    tv4.validateResult(data, regressionReportSchema, true, false)
};
