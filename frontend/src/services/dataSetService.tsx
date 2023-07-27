// Use the page and rowsPerPage in param for pagination which is already implemented in API
export async function getDataSet(page?: number, rowsPerPage?: number) {
  try {
    const response: any = await fetch(`/v1/datasets/details`, {
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

export async function createDataSetRequest(formData: FormData, dataSetName: string, batchName: string): Promise<void> {
  try {
    const response = await fetch('/v1/datasets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: dataSetName, testDataIds: [] })
    });

    if (!response.ok)
      throw new Error(`${response.status} returned from api`);

    const dataSetResponse = await response.json();
    await uploadTestData(dataSetResponse.id, formData, batchName);
    return dataSetResponse.id;
  }
  catch (error) {
    throw error;
  }
}

async function uploadTestData(dataSetIdResponse: string, formData: FormData, batchName: string): Promise<void> {
  try {
    const response = await fetch(`/v1/datasets/${dataSetIdResponse}/upload?batchName=${batchName}`, {
      method: 'PUT',
      body: formData
    });

    if (!response.ok)
      throw new Error(`${response.status} returned from api`);

    return;
  }
  catch (error) {
    throw error;
  }
}
