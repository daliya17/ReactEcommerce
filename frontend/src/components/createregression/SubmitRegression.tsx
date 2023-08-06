import React, { ReactElement, useEffect, useState } from "react";
import { Checkbox, Form, FormField } from "@athena/forge";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    selectForm,
    selectNext,
    toggleForm,
    toggleModal,
    toggleNext,
    updateLoad
} from "../../slice/AppSlice";
import {
    selectComparatorConfigId,
    selectDataSetId,
    selectRegenerateReferenceData,
    selectRegressionId,
    selectRegressionName,
    toggleRegenerateReferenceData,
    updateRegressionId,
    updateRegressionName
} from "../../slice/CreateRegressionSlice";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { submitRequest } from "../../services/regressionService";

function SubmitRegression(): ReactElement {
    const dispatch: Dispatch<AnyAction> = useDispatch();
    const hideNext: boolean = useSelector(selectNext);
    const dataSetId: string = useSelector(selectDataSetId);
    const comparatorConfigId: string = useSelector(selectComparatorConfigId);
    const regressionName: string = useSelector(selectRegressionName);
    const regenerateReferenceData: boolean = useSelector(selectRegenerateReferenceData);
    const regressionId: string = useSelector(selectRegressionId);
    const disableForm: boolean = useSelector(selectForm);
    const [errors, setErrors] = useState<any>({});
    const navigate = useNavigate();

    useEffect(() => {
        if (disableForm && !regressionId)
            dispatch(toggleForm());

        if (!hideNext && !regressionId)
            dispatch(toggleNext());
    }, [hideNext, disableForm, regressionId, dispatch])

    function handleNameChange(event: React.FormEvent<HTMLInputElement>): void {
        dispatch(updateRegressionName(event.currentTarget.value));
    }

    function handleCheckBoxChange(event: React.FormEvent<HTMLInputElement>): void {
        dispatch(toggleRegenerateReferenceData());
    }

    async function refreshPage(text: string): Promise<void> {
        if ('clipboard' in navigator)
            await navigator.clipboard.writeText(text);

        setTimeout(() => {
            navigate('/');
        }, 4000);
    }

    function submitRegression(event: React.FormEvent<HTMLInputElement>): void {
        event.preventDefault();

        const error: any = {};
        if (!regressionName) {
            error.regressionName = "You have not entered regression name";
            setErrors(error);
            return;
        }

        dispatch(updateLoad('loading'));

        submitRequest(regressionName, dataSetId, comparatorConfigId, regenerateReferenceData).then((id) => {
            dispatch(updateRegressionId(id));
            dispatch(toggleModal(`Successfully created regression id ${id}`));
            dispatch(toggleForm());
            return refreshPage(id);
        }).catch((error) => {
            dispatch(toggleModal('Regression Creation failed'));
            console.error(error);
        }).finally(() => {
            dispatch(updateLoad('loaded'));
        });
    }

    return (
        <React.Fragment>
            <fieldset className={`form-fieldset${disableForm ? "-disabled" : ""}`}>
                <legend>Submit Regressopn</legend>
                <Form onSubmit={submitRegression} buttonText="Submit">
                    <FormField
                        id="regression-name"
                        labelText="Regression Name"
                        onChange={handleNameChange}
                        value={regressionName}
                        error={errors.regressionName || ''}
                        required
                    />
                    <FormField
                        id="data-set-id"
                        labelText="Data Set Id"
                        value={dataSetId}
                        disabled
                    />
                    <FormField
                        id="comparator-config-id"
                        labelText="Comparator Config Id"
                        value={comparatorConfigId}
                        disabled
                    />
                    <FormField
                        id="regenerate-reference-data"
                        labelText="Regenerate Reference Data"
                        onChange={handleCheckBoxChange}
                        inputAs={Checkbox}
                        checked={regenerateReferenceData}
                        description="Regenerate Reference Data"
                    />
                </Form>
            </fieldset>
        </React.Fragment>
    );
}

export default SubmitRegression;