/**
 * This module exports a singleton object that holds the field names
 * This object is refreshed everytime the comparison data is object
 * from the server
 */
class FieldsLibrary {
  fields = {};
  fieldOptions = [];

  addField(field) {
    if (!this.fields[field]) {
      this.fields[field] = this.fieldOptions.length;
      this.fieldOptions.push({
        label: field,
        value: field
      });
    }
  }

  getFieldOptions() {
    return this.fieldOptions;
  }

  isFreezed(freezedFields, fieldId) {
    const fieldIndex = this.fields[fieldId];
    return fieldIndex in freezedFields;
  }
}

export default new FieldsLibrary();
