import React, { ReactElement, useEffect, useState } from "react";
import { Button, Card, GridCol, GridRow } from "@athena/forge";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";

import { useParams } from 'react-router-dom';
import {
    RegressionReport as ReportObject,
    selectBatchCount,
    selectErrorInfo,
    selectStatusInfo,
    updateReport
} from "../slice/RegressionReportSlice";
import { toggleModal, updateLoad } from "../slice/AppSlice";
import PageHeader from "./PageHeader";
import { fetchRegression } from "../services/regressionService";

function RegressionReport(): ReactElement {
    let { regressionIds } = useParams() || '';

    const dispatch: Dispatch<AnyAction> = useDispatch();
    const batchCount: number = useSelector(selectBatchCount);
    const statusInfo: any = useSelector(selectStatusInfo);
    const errorInfo: any = useSelector(selectErrorInfo);
    const [regressionId, setRegressionId] = useState<string | undefined>(regressionIds);
    useEffect(() => {
        showReport();
    }, []);
    const [errors, setErrors] = useState<any>({});

    function handleRegressionChange(event: React.FormEvent<HTMLInputElement>): void {
        setRegressionId(event.currentTarget.value);
    }

    function legendView(dataMap: any): ReactElement {
        return (
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Status</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dataMap.map((entry: any, index: number) => (
                            <tr key={`legend-${index}`}>
                                <td>
                                    <svg width="25" height="10">
                                        <rect width="100%" height="100%" style={{ fill: entry.color }}></rect>
                                    </svg>
                                </td>
                                <td>{entry.status || entry.error}</td>
                                <td className="left-align">{entry.count}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        );
    }

    function getRandomColor(): string {
        const hexTab: string = "5555556789ABCDEF";
        const red: string = hexTab[Math.floor(Math.random() * 16)];
        const green: string = hexTab[Math.floor(Math.random() * 16)];
        const blue: string = hexTab[Math.floor(Math.random() * 16)];
        return '#' + red + green + blue;
    }

    function prepareReport(response: any): ReportObject {
        let count: number = 0;
        const statusMap: any = {};
        const errorMap: any = {};
        if (response.regressionInfo) {
            response.regressionInfo.forEach((entry: any) => {
                count++;

                if (entry.status !== undefined) {
                    if (entry.status in statusMap) {
                        statusMap[entry.status] += 1;
                    }
                    else {
                        statusMap[entry.status] = 1;
                    }

                    if (/^FAILED.*/.test(entry.status)) {
                        let errorCode: string = 'INTERMITTENT ERROR';
                        if (entry.errorCode !== undefined) {
                            if (/^INTERNAL.*/.test(entry.errorCode.toUpperCase()))
                                errorCode = 'ANET ERROR';
                            if (/^EXTERNAL.*/.test(entry.errorCode.toUpperCase()))
                                errorCode = 'CHARON ERROR';
                        }

                        if (errorCode in errorMap) {
                            errorMap[errorCode] += 1;
                        }
                        else {
                            errorMap[errorCode] = 1;
                        }
                    }
                }
            });
        }

        const statusInfo: any = [];
        for (const [key, value] of Object.entries(statusMap)) {
            statusInfo.push({
                status: key,
                count: value,
                color: getRandomColor()
            });
        }

        const errorInfo: any = [];
        for (const [key, value] of Object.entries(errorMap)) {
            errorInfo.push({
                error: key,
                count: value,
                color: getRandomColor()
            });
        }

        return {
            batchCount: count,
            statusInfo: statusInfo,
            errorInfo: errorInfo
        };
    }

    function showReport(): void {
        const error: any = {};
        if (!regressionId) {
            error.regressionId = 'You have not entered regression id';
            setErrors(error);
            return;
        }
        dispatch(updateLoad('loading'));
        fetchRegression(regressionId).then((response: any) => {
            return prepareReport(response);
        }).then((response: ReportObject) => {
            dispatch(updateReport(response));
        }).catch((error) => {
            dispatch(toggleModal('Unable to fetch regression report'));
            console.error(error);
        }).finally(() => {
            dispatch(updateLoad('loaded'));
        });
    }

    function downloadReport(): void {
        window.open(`/v1/regressions/${regressionId}/report`, '_blank');
    }

    return (
        <React.Fragment>
            <PageHeader title="Regression Report" />
            {
                batchCount > 0 && (
                    <React.Fragment>
                        <div className="download-report-div">
                            <Button text="Download Report" variant="secondary" icon="Download" onClick={downloadReport} />
                        </div>
                        <GridRow>
                            <GridCol width={{ small: 2, medium: 2, large: 2 }}>
                                <Card headingText="Count">
                                    <div className="report-count">{batchCount}</div>
                                </Card>
                            </GridCol>
                            <GridCol width={{ small: 5, medium: 5, large: 5 }}>
                                <Card headingText="Status Splitup">
                                    <ResponsiveContainer minWidth={450} minHeight={400}>
                                        <PieChart width={450} height={400}>
                                            <Pie data={statusInfo} nameKey="status" dataKey="count" innerRadius={30} labelLine={false}>
                                                {
                                                    statusInfo.map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))
                                                }
                                            </Pie>
                                            <Tooltip />
                                            <Legend content={legendView(statusInfo)} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                            </GridCol>
                            <GridCol width={{ small: 5, medium: 5, large: 5 }}>
                                <Card headingText="Error Splitup">
                                    <ResponsiveContainer minWidth={450} minHeight={400}>
                                        <PieChart>
                                            <Pie data={errorInfo} nameKey="error" dataKey="count" innerRadius={30} labelLine={false}>
                                                {
                                                    errorInfo.map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))
                                                }
                                            </Pie>
                                            <Tooltip />
                                            <Legend content={legendView(errorInfo)} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                            </GridCol>
                        </GridRow>
                    </React.Fragment>
                )
            }
        </React.Fragment>
    );
}

export default RegressionReport;