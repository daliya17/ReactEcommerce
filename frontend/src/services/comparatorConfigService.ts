import { ComparatorConfig } from "../slice/CreateRegressionSlice";
import { ComparatorConfigResponse } from "../types";

export async function fetchComparatorConfig(): Promise<ComparatorConfig[]> {
    try {
        const response = await fetch('/v1/comparator/configs', {
            method: 'GET'
        });

        if (!response.ok)
            throw new Error(`${response.status} returned from api`);

        const configResponse: Array<ComparatorConfigResponse> = await response.json();

        const config: Array<ComparatorConfig> = [];
        configResponse.forEach((element) => {
            config.push({ id: element.id, name: element.name });
        });

        return config;
    }
    catch (error) {
        throw error;
    }
}

export async function fetchConfigDetails(configId: string): Promise<Array<string>> {
    try {
        const response = await fetch(`/v1/comparator/configs/${configId}`, {
            method: 'GET'
        });

        if (!response.ok)
            throw new Error(`${response.status} returned from api`);

        const jsonResponse = await response.json();

        if (jsonResponse.fieldsToCompare && jsonResponse.fieldsToCompare.length > 0)
            return jsonResponse.fieldsToCompare;

        return [];
    }
    catch (error) {
        throw error;
    }
}