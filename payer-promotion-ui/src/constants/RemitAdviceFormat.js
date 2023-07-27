const remitAdviceFormat = Object.freeze({
  ANSI835: 'ANSI835',
  JSON: 'JSON',
  Null: 'null'
});

export default remitAdviceFormat;

export const remitAdviceFormatLabels = {};
Object.keys(remitAdviceFormat).forEach(format => {
  remitAdviceFormatLabels[remitAdviceFormat[format]] = format.toLowerCase();
  if (format === 'Null') {
    remitAdviceFormatLabels[remitAdviceFormat[format]] = 'other';
  }
});
