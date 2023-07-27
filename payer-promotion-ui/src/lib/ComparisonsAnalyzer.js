import FieldStatuses from '../constants/FieldStatuses';
import Lib from './index';
import FieldsLibrary from './FieldsLibrary';

const statusMap = {
  [FieldStatuses.Matched]: 'matched',
  [FieldStatuses.Added]: 'added',
  [FieldStatuses.Different]: 'different',
  [FieldStatuses.Removed]: 'removed'
};

class ComparisonsAnalyzer {
  comparisonsResult;

  constructor(comparisonsResult) {
    this.comparisonsResult = comparisonsResult;
  }

  process() {
    if (!this.comparisonsResult) return;

    this._processLevel(this.comparisonsResult);

    (this.comparisonsResult.claims || []).forEach(claim => {
      this._processLevel(claim, claim.diffId);
      (claim.charges || []).forEach(charge => {
        this._processLevel(charge, claim.diffId || charge.diffId);
      });
    });

    (this.comparisonsResult.batchExceptions || []).forEach(batchException => {
      this._processLevel(batchException, batchException.diffId);
    });
  }

  _processLevel(level, diffId) {
    (level.fields || []).forEach(field => {
      // first normalize the field status
      this._setFieldStatus(field);
      // populate diff id in case of level diff to all the fields
      diffId && this._addDiffIdToField(field, diffId);
      // add the field to fields library
      this._addFieldToLibrary(field.id);
      // add field comparison status based statistics for the level
      this._setLevelStatistics(level, field);
      // set keywords for the level
      this._setKeywords(level, field);
    });
    // calculate and set percentage of comparison status based statistics
    this._setStatisticsPercentage(level);
  }

  /**
   * Populates the diff id from the parent level to the field
   * @param {object} field - field object
   * @param {string} diffId - diff id from the parent level
   */
  _addDiffIdToField(field, diffId) {
    const fieldStatus = field.stat;
    // only set diff Id if the status is added, different or removed
    if (
      FieldStatuses.Added === fieldStatus ||
      FieldStatuses.Different === fieldStatus ||
      FieldStatuses.Removed === fieldStatus
    ) {
      field.diffId = diffId;
    }
  }

  /**
   * Add the field to FieldsLibrary
   * @param {string} fieldName
   */
  _addFieldToLibrary(fieldName) {
    if (fieldName) FieldsLibrary.addField(fieldName);
  }

  /**
   * Calculates the fields count based on comparison status and
   * sets it to the key 'statistics' of this level
   * @param {object} level - batch, claim, charge, batchException
   * @param {object} field - field object
   */
  _setLevelStatistics(level, field) {
    if (level) {
      level.statistics = level.statistics || {
        total: 0,
        matched: 0,
        added: 0,
        different: 0,
        removed: 0
      };

      const fieldStat = statusMap[field.stat];
      if (fieldStat) {
        level.statistics.total++;
        level.statistics[fieldStat]++;
      }
    }
  }

  /**
   * Calculates the percentage for each comparison status for the level
   * based on the fields count set by the _setLevelStatistics
   * @param {object} level
   */
  _setStatisticsPercentage(level) {
    if (level.statistics) {
      level.statistics.matchedp = Lib.percent(
        level.statistics.matched,
        level.statistics.total
      );
      level.statistics.addedp = Lib.percent(
        level.statistics.added,
        level.statistics.total
      );
      level.statistics.differentp = Lib.percent(
        level.statistics.different,
        level.statistics.total
      );
      level.statistics.removedp = Lib.percent(
        level.statistics.removed,
        level.statistics.total
      );
    }
  }

  /**
   * Sets the actual status of the field. Status is set as IGNORED
   * if it has the ignoreRuleId
   * @param {object} field
   */
  _setFieldStatus(field) {
    if (field.ignoreRuleId) field.stat = FieldStatuses.Ignored;
  }

  /**
   * Sets keyword for this level to enable fast filtering
   * @param {object} level
   * @param {object} field
   */
  _setKeywords(level, field) {
    const id = field.id || '';
    const stat = field.stat;
    level.keywords = level.keywords || {};

    // field + stat keyword
    level.keywords[id + '-' + stat] = 1;

    // diffId keyword
    if (field.diffId) level.keywords[field.diffId] = 1;

    // rule + stat keyword
    if (field.evals instanceof Array) {
      field.evals.forEach(ev => {
        const rule = ev.id || '';
        if (rule) {
          level.keywords[rule + '-' + stat] = 1;
        }
      });
    }
  }
}

export default ComparisonsAnalyzer;
