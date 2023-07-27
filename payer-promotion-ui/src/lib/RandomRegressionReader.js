class RandomRegressionReader {
  headers = [];

  initializeHeaders() {
    this.headers = [];
    this.headers.push({ name: 'KRCID', nullCount: 0, inValidCount: 0 });
    this.headers.push({ name: 'KRCNAME', nullCount: 0, inValidCount: 0 });
    this.headers.push({ name: 'IRCID', nullCount: 0, inValidCount: 0 });
    this.headers.push({ name: 'IRCNAME', nullCount: 0, inValidCount: 0 });
    this.headers.push({ name: 'PBID', nullCount: 0, inValidCount: 0 });
  }
  readRandomData(csvData, batchCount, randomBatches) {
    let searchIndexes = [];

    batchCount = Number(batchCount);

    if (csvData.length <= batchCount) {
      searchIndexes = Array.from(
        new Array(csvData.length),
        (val, index) => index
      );
    } else {
      while (searchIndexes.length < batchCount) {
        const searchIndex = Math.floor(Math.random() * csvData.length);
        if (searchIndexes.indexOf(searchIndex) === -1) {
          searchIndexes.push(searchIndex);
        }
      }
    }

    for (let index = 0; index < searchIndexes.length; index++) {
      csvData[searchIndexes[index]] &&
        randomBatches.push(csvData[searchIndexes[index]]);
    }
  }

  removeDuplicate(batchUpload) {
    return batchUpload.reduce((arr, current) => {
      const newObj = Object.fromEntries(
        Object.entries(current).map(([k, v]) => [k.toLowerCase(), v])
      );
      return arr.find((item) => item.pbid === newObj.pbid)
        ? arr
        : arr.concat(newObj);
    }, []);
  }

  validateRandomData(batchUpload) {
    this.initializeHeaders();

    let result = this.validateRandomDataHeader(batchUpload[0]);
    if (result) {
      return result;
    }
    this.validateByHeaders(batchUpload);

    return this.getValidateResult(batchUpload.length);
  }

  validateRandomDataHeader(randomBatch) {
    var commonContent = ' header is missing.';

    var csvHeaders = Object.keys(randomBatch);
    for (let header of this.headers) {
      if (!csvHeaders.find((key) => key === header.name)) {
        return header.name + commonContent;
      }
    }

    return '';
  }

  validateByHeaders(batchUpload) {
    batchUpload.forEach((batch) => {
      Object.entries(batch).forEach(([key, value]) => {
        if (!key) {
          return;
        }
        if (!value) {
          let header = this.headers.find((obj) => obj.name === key);
          if (header) {
            header.nullCount++;
          }
          return;
        }

        if (key === 'KRCID') {
          if (isNaN(value) || Number(value) < 0) {
            this.headers.find((obj) => obj.name === key).inValidCount++;
          }
        }

        if (key === 'IRCID') {
          if (isNaN(value) || Number(value) < 1) {
            this.headers.find((obj) => obj.name === key).inValidCount++;
          }
        } else if (key === 'PBID') {
          if (!this.isValidPB(value)) {
            this.headers.find((obj) => obj.name === key).inValidCount++;
          }
        }
      });
    });
  }

  getValidateResult(totalRows) {
    for (var header of this.headers) {
      if (header.nullCount > 0) {
        return (
          header.name +
          ': ' +
          header.nullCount +
          ' out of ' +
          totalRows +
          ' are empty.'
        );
      }
      if (header.inValidCount > 0) {
        if (header.name === 'PBID') {
          return (
            header.name +
            ': ' +
            header.inValidCount +
            ' out of  ' +
            totalRows +
            ' are not correct format.'
          );
        }
        return (
          header.name +
          ': ' +
          header.inValidCount +
          ' out of  ' +
          totalRows +
          ' are not a number.'
        );
      }
    }
    return '';
  }

  isValidPB(pbid) {
    var regex = /^\d+A\d+$/;
    return regex.test(pbid);
  }
}
export default new RandomRegressionReader();
