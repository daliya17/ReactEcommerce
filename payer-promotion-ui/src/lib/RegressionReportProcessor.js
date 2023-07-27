import FieldStatuses from '../constants/FieldStatuses';
import PayersLibrary from './PayersLibrary';
import ScoreBuckets from '../constants/ScoreBuckets';
import DiffCategoriesLibrary from './DiffCategoriesLibrary';

class RegressionReportProcessor {
  reports;

  constructor(reports) {
    this.reports = reports;
  }

  process() {
    this.reports.levels = this._processReport(this.reports.levels, [
      FieldStatuses.Added,
      FieldStatuses.Removed
    ]);
    this.reports.fields = this._processReport(this.reports.fields, [
      FieldStatuses.Added,
      FieldStatuses.Different,
      FieldStatuses.Removed,
      FieldStatuses.Ignored
    ]);
    this.reports.rules = this._processReport(this.reports.rules, [
      FieldStatuses.Matched,
      FieldStatuses.Added,
      FieldStatuses.Different,
      FieldStatuses.Removed,
      FieldStatuses.Ignored
    ]);
    this._statusCategory();
    this._bucketBatches();
    this.reports.fieldCategories = this._categorizeDiffs(
      this.reports.fieldCategories
    );
    this.reports.levelCategories = this._categorizeDiffs(
      this.reports.levelCategories
    );
  }

  /**
   * Source data is of the form
```
{
  categoryId => {
    fieldName/levelName => {
      comparisonStatus => fieldsCount
    }
  }
}
```
   * This will be converted to two reports(arrays for feeding to table).
   * One is by category, other is by fieldName/categoryName.
   * So return data is of the form
```
{
  categoryFirst: [
    {
      type: "", // Category Name
      category: "", // Id of the category
      ADDED: 0, // cumulative fieldsCount for the status ADDED for this category
      ... // other statuses
      children: [ // fields in this category
        {
          type: "", // Field Name
          category: "", // Parent category Id
          field: "", // Field Name
          ... // fields count for each status
        },
        ...
      ]
    },
    ...
  ],
  fieldFirst: [
    {
      type: "", // Field Name
      field: "", // Field Name
      ADDED: 0, // cumulative fieldsCount for the status ADDED for this field
      ... // similarly for other statuses
      children: [ // categories having this field
        {
          type: "", // Category Name
          category: "", // This category Id
          field: "", // Parent field Name
          ... // fields count for each status
        },
        ...
      ]
    },
    ...
  ]
}
```
   */
  _categorizeDiffs(categoriesReport = {}) {
    const byField = {};
    const byCategory = {};

    Object.keys(categoriesReport).forEach(categoryId => {
      const fieldsReport = categoriesReport[categoryId] || {};
      const categoryName = this._getCategoryName(categoryId);

      Object.keys(fieldsReport).forEach(field => {
        const statusReport = fieldsReport[field] || {};

        byField[field] = this._mergeDiff(
          byField[field] || {},
          statusReport,
          categoryName,
          field,
          categoryId
        );
        byCategory[categoryId] = this._mergeDiff(
          byCategory[categoryId] || {},
          statusReport,
          field,
          field,
          categoryId
        );
      });
    });

    const fieldFirst = Object.keys(byField).map(field => {
      return {
        ...byField[field],
        type: field,
        field
      };
    });

    const categoryFirst = Object.keys(byCategory).map(categoryId => {
      const categoryName = this._getCategoryName(categoryId);
      return {
        ...byCategory[categoryId],
        type: categoryName,
        category: categoryId
      };
    });

    return {
      fieldFirst,
      categoryFirst
    };
  }

  _getCategoryName = categoryId => {
    const category = DiffCategoriesLibrary.getDiffCategory(categoryId);
    return category ? category.name : 'Uncategorized';
  };

  _mergeDiff(typeReport, statusReport, type, field, category) {
    const shouldTotalAtStatus = !('total' in statusReport);

    Object.values(FieldStatuses).forEach(status => {
      const statusCount = statusReport[status] || 0;

      if (shouldTotalAtStatus) {
        statusReport.total = statusReport.total || 0;
        statusReport.total += statusCount;
      }

      typeReport[status] = (typeReport[status] || 0) + statusCount;
      typeReport.total = (typeReport.total || 0) + statusCount;
    });

    typeReport.children = typeReport.children || [];
    typeReport.children.push({
      ...statusReport,
      type,
      field,
      category
    });

    return typeReport;
  }

  _processReport(report, statuses) {
    if (!report) return [];

    return Object.keys(report).map(id => {
      const categoryReport = report[id];
      let totalCount = 0;
      statuses.forEach(status => {
        const statusReport = categoryReport[status] || {};
        const batches = [];
        let statusCount = 0;
        Object.keys(statusReport).forEach(batchId => {
          const batch = statusReport[batchId];
          batch.batchId = batchId;
          batch.payer = PayersLibrary.getPayerName(batch.payerId);
          statusCount += batch.count;
          batches.push(batch);
        });

        categoryReport[status] = batches;
        categoryReport[status + 'count'] = statusCount;
        totalCount += statusCount;
      });

      categoryReport.id = id;
      categoryReport.total = totalCount;
      return categoryReport;
    });
  }

  _statusCategory() {
    const batchDetails = this.reports.batches || {};
    let statusCategoriesReport = {};

    Object.keys(batchDetails).forEach(batchId => {
      const batch = {
        batchId,
        payerId: batchDetails[batchId].payerId,
        payer: PayersLibrary.getPayerName(batchDetails[batchId].payerId),
        status: batchDetails[batchId].status,
        statusCategory: batchDetails[batchId].statusCategory
      };
      const statusCategory = batch.statusCategory;
      const status = batch.status;

      statusCategoriesReport[statusCategory] =
        statusCategoriesReport[statusCategory] || {};

      statusCategoriesReport[statusCategory][status] = statusCategoriesReport[
        statusCategory
      ][status] || {
        count: 0,
        group: status,
        status,
        statusCategory,
        batches: []
      };

      const statusReport = statusCategoriesReport[statusCategory][status];
      statusReport.count++;
      statusReport.batches.push(batch);
    });

    this.reports.statusCategory = Object.keys(statusCategoriesReport).map(
      statusCategory => {
        let count = 0;
        const statusCategoryReport = Object.keys(
          statusCategoriesReport[statusCategory]
        ).map(status => {
          const statusReport = statusCategoriesReport[statusCategory][status];
          count += statusReport.count;

          return statusReport;
        });

        return {
          count,
          group: statusCategory,
          statusCategory,
          children: statusCategoryReport
        };
      }
    );
  }

  _bucketBatches() {
    const buckets = {};
    Object.keys(ScoreBuckets).forEach(bucketName => {
      buckets[bucketName] = [];
    });

    const batches = this.reports.batches || {};
    Object.keys(batches).forEach(batchId => {
      const score = batches[batchId].score || 0;
      const batch = {
        batchId,
        payerId: batches[batchId].payerId,
        payer: PayersLibrary.getPayerName(batches[batchId].payerId),
        score: score.toFixed(2)
      };

      if (score >= 90) {
        buckets.ge90.push(batch);
        return;
      }
      if (score >= 70) {
        buckets.ge70.push(batch);
        return;
      }
      if (score >= 50) {
        buckets.ge50.push(batch);
        return;
      }
      if (score >= 30) {
        buckets.ge30.push(batch);
        return;
      }
      if (score >= 0) {
        buckets.ge0.push(batch);
      }
    });

    this.reports.batches = Object.keys(ScoreBuckets).map(bucketName => {
      return {
        id: bucketName,
        name: ScoreBuckets[bucketName],
        count: buckets[bucketName].length,
        batches: buckets[bucketName]
      };
    });
  }
}

export default RegressionReportProcessor;
