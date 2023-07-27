class PayersLibrary {
  payers = [];
  payersMap = {};
  payersOptions = [];

  initialize(payers = []) {
    this.payers = payers;
    this.payers.forEach(payer => {
      this.payersMap[payer.payerId] = payer;
      this.payersOptions.push({
        label: payer.payerName + ' [' + payer.payerId + ']',
        value: payer.payerId
      });
    });
  }

  getPayers() {
    return this.payers;
  }

  getPayerName(payerId) {
    const payer = this.payersMap[payerId];
    if (payer) {
      return payer.payerName;
    }
    return '';
  }

  getPayer(payerId) {
    return this.payersMap[payerId];
  }

  getPayerOptions() {
    return this.payersOptions;
  }

  parsePayerList(payers) {
    let invalidText = '';
    let payerList = [];

    for (let index = 0; index < payers.length; index++) {
      const payerData = payers[index];

      if (
        !payerData.ircId &&
        !payerData.ircName &&
        !payerData.krcId &&
        !payerData.krcName
      ) {
        continue;
      }

      if (!payerData.ircId) {
        invalidText = 'IRC ID';
        break;
      }
      if (!payerData.ircName) {
        invalidText = 'IRC Name';
        break;
      }
      if (!payerData.krcId) {
        invalidText = 'KRC ID';
        break;
      }
      if (!payerData.krcName) {
        invalidText = 'KRC Name';
        break;
      }

      payerList.push(payerData);
    }

    return {
      invalidText,
      payerList
    };
  }
}

export default new PayersLibrary();
