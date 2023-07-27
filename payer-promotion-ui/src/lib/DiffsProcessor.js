import { statusLabels } from '../constants/FieldStatuses';
import DiffCategoriesLibrary from './DiffCategoriesLibrary';
import PayersLibrary from './PayersLibrary';

const levels = {
  CLAIM: true,
  CHARGE: true,
  BATCHEXCEPTION: true
};

/**
 * This class processes the diffs for a batch to store it view friendly
 */
class DiffsProcessor {
  static process(diffs) {
    const diffsMap = {};
    (diffs || []).forEach(diff => {
      const diffCategory =
        DiffCategoriesLibrary.getDiffCategory(diff.categoryId) || {};

      diffsMap[diff.id] = {
        ...diff,
        category: diffCategory.name,
        status: diffCategory.status,
        description: diffCategory.description,
        isLevel: levels[diff.fieldName]
      };
    });
    return diffsMap;
  }

  static populate(diffs) {
    diffs.forEach(diff => {
      diff.payerName = PayersLibrary.getPayerName(diff.payerId);
      diff.categoryName = DiffCategoriesLibrary.getCategoryName(
        diff.categoryId
      );
      diff.statusName = statusLabels[diff.status];
    });
  }

  static injectDiffs(fields, diffs) {
    return fields.map(field => field);
  }
}

export default DiffsProcessor;
