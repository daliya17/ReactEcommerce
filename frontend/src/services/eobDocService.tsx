export async function getContextAndPaymentBatchFromRegressionResult(regressionInfoId: string, dataType: string) {
  try {
    const params = new URLSearchParams();
    params.append('dataKeys', 'CONTEXTID,PAYMENTBATCHID');
    const url = `/v1/regressions/info/${regressionInfoId}/files/datatype/${dataType}?${params}`;
    const response: any = await fetch(url, {
      method: 'GET'
    });

    if (!response.ok)
      throw new Error(`${response.status} returned from api`);
    return await response.json();
  }
  catch (error) {
    throw error;
  }
}