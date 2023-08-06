import React, { ReactElement, useEffect, useState } from "react";
import { Form, FormField, ReadOnlyInput, Select } from "@athena/forge";
import { useDispatch, useSelector } from "react-redux";
import {
    selectForm,
    selectNext,
    toggleForm,
    toggleModal,
    toggleNext,
    updateLoad
} from "../../slice/AppSlice";
import {
    ComparatorConfig,
    selectComparatorConfig,
    selectComparatorConfigId,
    selectConfigFields,
    updateComparatorConfig,
    updateComparatorConfigId,
    updateConfigFields
} from "../../slice/CreateRegressionSlice";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { fetchComparatorConfig, fetchConfigDetails } from "../../services/comparatorConfigService";

function ChooseComparatorConfig(): ReactElement {
    const dispatch: Dispatch<AnyAction> = useDispatch();
    const hideNext: boolean = useSelector(selectNext);
    const comparatorConfig: ComparatorConfig[] = useSelector(selectComparatorConfig);
    const comparatorConfigId: string = useSelector(selectComparatorConfigId);
    const configDetails: string[] = useSelector(selectConfigFields);
    const disableForm: boolean = useSelector(selectForm);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (disableForm && comparatorConfig.length === 0)
            dispatch(toggleForm());

        if (!hideNext && comparatorConfig.length === 0) {
            dispatch(toggleNext());

            fetchComparatorConfig().then((config) => {
                dispatch(updateComparatorConfig(config));
            }).catch((error) => {
                dispatch(toggleModal('Unable to fetch Comparator Config'));
                console.error(error);
            });
        }
    }, [disableForm, hideNext, comparatorConfig, dispatch])

    function handleConfigChange(event: React.FormEvent<HTMLInputElement>): void {
        const configId = event.currentTarget.value;
        dispatch(updateComparatorConfigId(configId));

        dispatch(updateLoad('loading'));
        fetchConfigDetails(configId).then((response) => {
            dispatch(updateConfigFields(response));
        }).catch((error) => {
            dispatch(toggleModal('Unable to fetch Comparator Config'));
            console.error(error);
        }).finally(() => {
            dispatch(updateLoad('loaded'));
        });
    }

    function chooseConfig(event: React.FormEvent<HTMLInputElement>): void {
        event.preventDefault();
        const error: any = {};
        if (!comparatorConfigId) {
            error.config = "You have not selected the comparator config";
            setErrors(error);
            return;
        }

        dispatch(toggleNext());
        dispatch(toggleForm());
    }

    return (
        <React.Fragment>
            <fieldset className={`form-fieldset${disableForm ? "-disabled" : ""}`}>
                <legend>Choose Comparator Config</legend>
                <Form onSubmit={chooseConfig} buttonText="Choose">
                    <FormField
                        id="comparator-config"
                        labelText="Comparator Config Name"
                        inputAs={Select}
                        onChange={handleConfigChange}
                        options={comparatorConfig.map((config) => { return { text: config.name, value: config.id } })}
                        value={comparatorConfigId}
                        error={errors.config || ''}
                        required
                    />
                    <FormField
                        id="comparator-details"
                        labelText="Fields to compare"
                        inputAs={ReadOnlyInput}
                        className="comparator-field-list"
                    >
                        {
                            configDetails.length > 0 && configDetails.map((str) => {
                                return (
                                    <React.Fragment>
                                        <p>
                                            {str}
                                        </p>
                                    </React.Fragment>
                                );
                            })
                        }
                    </FormField>
                </Form>
            </fieldset>
        </React.Fragment>
    )
}

export default ChooseComparatorConfig;