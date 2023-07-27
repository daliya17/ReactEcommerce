import React, { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    toggleNext,
    selectNext,
    updateLoad,
    selectForm,
    toggleForm,
    toggleModal
} from "../../slice/AppSlice";
import {
    selectBatchName,
    updateDataSetId,
    selctDataSetName,
    selectDataSetId,
    updateDataSetName,
    updateBatchName,
    selectInputDataType,
    updateInputDataType
} from "../../slice/CreateRegressionSlice";
import { Form, FormField, Button } from "@athena/forge";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import ExistingDataSetList from "../ExistingDataSetList";
import { createDataSetRequest } from "../../services/dataSetService";

function CreateDataSet(): ReactElement {

    const dispatch: Dispatch<AnyAction> = useDispatch();
    const hideNext: boolean = useSelector(selectNext);
    const batchName: string = useSelector(selectBatchName);
    const dataSetName: string = useSelector(selctDataSetName);
    const dataSetId: string = useSelector(selectDataSetId);
    const disableForm: boolean = useSelector(selectForm);
    const [file, setFile] = useState<File>();
    const dataInputType = useSelector(selectInputDataType);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (disableForm && !dataSetId)
            dispatch(toggleForm());

        if (!hideNext && !dataSetId)
            dispatch(toggleNext());
    }, [dataSetId, hideNext, disableForm, dispatch]);

    function downloadTestDataTemplate(): void {
        window.open('/v1/testdata/template', '_blank');
    }

    function handleDataSetNameChange(event: React.FormEvent<HTMLInputElement>): void {
        dispatch(updateDataSetName(event.currentTarget.value));
    }

    function handleBatchNameChange(event: React.FormEvent<HTMLInputElement>): void {
        dispatch(updateBatchName(event.currentTarget.value));
    }

    function handleFileChange(event: React.FormEvent<HTMLInputElement>): void {
        if (event.currentTarget.files) {
            setFile(event.currentTarget.files[0]);
        }
    }

    function createDataSet(event: React.FormEvent<HTMLInputElement>): void {
        event.preventDefault();
        const error: any = {};
        if (!dataSetName) {
            error.dataSetName = "You have not entered a data set name";
        }

        if (!batchName) {
            error.batchName = "You have not entered a batch name";
        }

        if (Object.keys(error).length > 0) {
            setErrors(error);
            return;
        }

        if (!file) {
            dispatch(toggleModal('You have not uploaded the test data file'));
            return;
        }

        const formData: FormData = new FormData();
        formData.append('file', file);

        dispatch(updateLoad('loading'));

        createDataSetRequest(formData, dataSetName, batchName).then((response: any) => {
            dispatch(updateDataSetId(response));
            dispatch(toggleForm());
            dispatch(toggleModal('Successfully Created Data Set'));
            dispatch(toggleNext());


        }).catch((error) => {
            dispatch(toggleModal('Data Set Creation Failed'));
            console.error(error);
        }).finally(() => {
            dispatch(updateLoad('loaded'));
        });
    }

    const inputTypeExistingData = useMemo(() => {
        return <><ExistingDataSetList /></>;
    }, []);

    function handleRegressionSourceChange(): JSX.Element {
        let createDataInput: JSX.Element = <></>;
        if (dataInputType === 'existing-data') {
            createDataInput = inputTypeExistingData;

        } else if (dataInputType === 'csv') {
            createDataInput = (
                <>
                    <Form onSubmit={createDataSet} buttonText="Create">
                        <FormField
                            id="dataset-name"
                            labelText="Data Set Name"
                            onChange={handleDataSetNameChange}
                            value={dataSetName}
                            error={errors.dataSetName || ''}
                            required
                        />
                        <FormField
                            id="batch-name"
                            labelText="Batch Name"
                            onChange={handleBatchNameChange}
                            value={batchName}
                            error={errors.batchName || ''}
                            required
                        />
                        <input type="file" onChange={handleFileChange} />
                    </Form>
                    <p>
                        Click <Button text="here" onClick={downloadTestDataTemplate} variant="tertiary" /> to download test data template
                    </p>
                </>
            );
        }
        return createDataInput;
    }

    return (
        <React.Fragment>
            <fieldset className={`form-fieldset${disableForm ? "-disabled" : ""}`}>
                <legend>Create Data Set</legend>
                <FormControl>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        <FormControlLabel
                            value="csv"
                            checked={dataInputType === 'csv'}
                            control={
                                <Radio
                                    onChange={() => {
                                        dispatch(updateInputDataType('csv'));
                                    }}
                                />
                            }
                            label="Create New From CSV"
                        />
                        <FormControlLabel
                            value="existing-data"
                            checked={dataInputType === 'existing-data'}
                            control={
                                <Radio
                                    onChange={() => {
                                        dispatch(updateInputDataType('existing-data'));
                                    }}
                                />
                            }
                            label="Select From Existing Data"
                        />
                    </RadioGroup>
                </FormControl>

                {handleRegressionSourceChange()}

            </fieldset>
        </React.Fragment>
    );
}

export default CreateDataSet;