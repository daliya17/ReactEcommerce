import React, { ReactElement, useState } from "react";
import CreateDataSet from "./createregression/CreateDataSet";
import ChooseComparatorConfig from "./createregression/ChooseComparatorConfig";
import SubmitRegression from "./createregression/SubmitRegression";
import { Stepper, Button } from '@athena/forge';
import { useSelector } from "react-redux";
import { selectNext } from "../slice/AppSlice";
import PageHeader from "./PageHeader";
import '../style/css/CreateRegression.css';

interface stepProps {
    index: number
};

function CreateRegression(): ReactElement {
    const steps: string[] = [
        'Create Dataset',
        'Choose Comparator Config',
        'Create Regression'
    ];
    const hideNext: boolean = useSelector(selectNext);
    const [currentStep, SetCurrentStep] = useState<number>(0);

    function onNext(): void {
        if (currentStep < steps.length - 1) {
            SetCurrentStep(currentStep + 1);
        }
    }

    function onSelect(index: number): void {
        SetCurrentStep(index);
    }

    function getNavigableSteps(): boolean[] {
        const navigableSteps: boolean[] = [];
        for (let index = 0; index < steps.length; index++) {
            navigableSteps.push(false);
        }
        return navigableSteps;
    }

    function Step(props: stepProps): ReactElement {
        if (props.index === 0) {
            return <CreateDataSet />;
        }

        if (props.index === 1) {
            return <ChooseComparatorConfig />;
        }

        if (props.index === 2) {
            return <SubmitRegression />;
        }

        return (
            <React.Fragment></React.Fragment>
        );
    }

    return (
        <React.Fragment>
            {/* <Heading text="Create Regression" variant="subsection" /> */}
            <PageHeader title="Regressions" />
            <div className="stepper-container">
                <Stepper style={{ width: '45%' }} selected={currentStep} onSelect={onSelect} steps={steps} navigableSteps={getNavigableSteps()} numerical />
            </div>
            <div className="fe_u_padding--low">
                <Step index={currentStep} />
                <div className="btn--next">
                    <Button text="Next" onClick={onNext} disabled={hideNext} />
                </div>
            </div>
        </React.Fragment>
    );
}

export default CreateRegression;