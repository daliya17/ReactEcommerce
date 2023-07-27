export async function getAllRegressions(page: number, rowsPerPage: number) {
  const params = new URLSearchParams();
  params.append('pageNumber', String(page));
  params.append('rowsPerPage', String(rowsPerPage));
  const url = `/v1/regressions?${params}`;
  try {
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

export async function getComparatorDiffForRegression(regressionId: string | undefined) {
  try {
    const response: any = await fetch(`/v1/regressions/${regressionId}/comparatordiffs`, {
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

export async function fetchRegression(id: string): Promise<any> {
  try {
    const response = await fetch(`/v1/regressions/${id}`, {
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

export async function submitRequest(regressionName: string, dataSetId: string, comparatorConfigId: string, regenerateReferenceData: boolean): Promise<string> {
  try {
    const response = await fetch('/v1/regressions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: regressionName, dataSetId: dataSetId, comparatorConfigId: comparatorConfigId, regenerateReferenceData: regenerateReferenceData })
    });

    if (!response.ok)
      throw new Error(`${response.status} returned from api`);

    const submitResponse = await response.json();
    return submitResponse.id;
  }
  catch (error) {
    throw error;
  }
}