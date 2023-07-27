import { Button, Icon, Loader, ShowHide } from '@athena/forge';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button as MuiButton } from "@material-ui/core";
import { Tooltip, IconButton } from "@mui/material";
import LoopIcon from '@mui/icons-material/Loop';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import ComparisonResultTable from './ComparisonResultTable';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import { eobData, getAllEobDoc, setEobData } from '../../slice/EobSlice';
import '../../style/css/ComparisonResult.css';
import { getComparatorDiffForRegression } from '../../services/regressionService';
import { getContextAndPaymentBatchFromRegressionResult } from '../../services/eobDocService';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

// Options to display in grouping category select
const groupingColumns: string[] = [
    'diffType',
    'referenceValue',
    'comparableValue',
    'regressionInfoId'
];

type map = {
    [key: string]: any;
};


function getStyles(name: string, groupingCategory: readonly string[], theme: Theme): any {
    return {
        fontWeight:
            groupingCategory.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

// component to get the comparison result for a regression and grouping function
export const ComparisonPageComponent = (): JSX.Element => {

    let { regressionId } = useParams() || '';
    const [load, setLoad] = useState('loading');
    const [initialData, setInitialData] = useState<comparisonResultType[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const theme = useTheme();
    const [groupingCategory, setGroupingCategory] = useState<string[]>([]);
    const dispatch = useDispatch();
    const seperator: string = '///';

    useEffect(() => {
        fetchComparisonData();
    }, []);


    const fetchComparisonData = async () => {
        try {
            setLoad('loading');
            setGroupingCategory([]);
            const comparatorDiffs = await getComparatorDiffForRegression(regressionId);
            let datas = comparatorDiffs.map((comparatorDiff: any, index: any) => {
                return {
                    id: index,
                    ...comparatorDiff
                };
            });
            setLoad('loaded')
            setRows(datas);
            setInitialData(datas);
            setColumns(tableColumns);
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    type comparisonResultType = {
        id: string;
        regressionId: string;
        field: string;
        diffType: string;
        referenceValue: string;
        comparableValue: string;
        paymentBatchId1: number;
        paymentBatchId2: number;
        context: number
        expanded: boolean;
        details: JSX.Element | string;
        [key: string]: string | boolean | number | JSX.Element;
    };

    // using the navigator to go to the respective column and toggle it
    function getToggledRowVal(rows: any, navigator: string[], pos: number): any {
        const navId = navigator[pos];
        if (navigator.length > pos) {
            rows.forEach((row: any) => {
                if (row['id'] == navId) {
                    if (navigator.length - 1 == pos) {
                        row['expanded'] = !row['expanded'];
                        return;
                    } else {
                        return getToggledRowVal(row.details.props.children.props.tableData, navigator, (pos + 1));
                    }
                }
                return;
            });
        }
        return rows;
    }

    // function to get new expanded or collapsed values
    function getNewRows(rows: { [key: string]: string | number | boolean | JSX.Element; id: string; regressionId: string; field: string; diffType: string; referenceValue: string; comparableValue: string; paymentBatchId1: number; paymentBatchId2: number; context: number; expanded: boolean; details: JSX.Element | string; }[], navigator: any, id: string): any {
        return getToggledRowVal(rows, [...navigator, id], 0);
    }

    let allEobDocs: Record<string, eobData> = useSelector(getAllEobDoc);
    const [localAllEobDocs, setLocalAllEobDocs] = useState(allEobDocs);

    useEffect(() => {
        setLocalAllEobDocs(allEobDocs);
    }, [allEobDocs]);

    useEffect(() => {
    }, [localAllEobDocs]);

    // function triggered when user open EOB
    async function handleEobOpen(row: any) {
        const regressionInfoId = row.rowData.regressionInfoId;
        let eobDocs: any = {};
        setLocalAllEobDocs(data => eobDocs = data);

        if (eobDocs[regressionInfoId]) {
            openEobOnNewTab(eobDocs[regressionInfoId]);
        } else {
            let contextAndPaymentBatch: string[] = await getContextAndPaymentBatchFromRegressionResult(regressionInfoId, 'REFERENCE');
            const eobData = { contextId: contextAndPaymentBatch[0], paymentBatchId: contextAndPaymentBatch[1] };
            dispatch(setEobData(({
                regressionInfoId: regressionInfoId,
                doc: eobData
            })));
            openEobOnNewTab(eobData)
        }
    }

    // logic to handle row collapse and expand while grouping
    const handleToggleDetailRow = (rowData: any): void => {
        const id = rowData.id;
        const navigator = rowData['navigator']['navigator'];
        if (navigator === '') {
            setRows((prevRows: any) => {
                return prevRows.map((row: any) => {
                    if (row.id === id) {
                        return { ...row, expanded: !row.expanded };
                    } else {
                        return row;
                    }
                })
            });
        } else {
            setRows(row => {
                const navigatorIds = navigator.split(seperator);
                const rows = getNewRows(row, navigatorIds.slice(1), id);
                return [...rows];
            })
        }
    }

    const copyToClipboard = (value: string) => {
        navigator.clipboard.writeText(value)
            .then(() => {
                console.log('Text copied to clipboard:', value);
            })
            .catch((error) => {
                console.error('Failed to copy text:', error);
            });
    };

    const tableColumns = [
        {
            key: 'id',
            displayName: 'ID',
            props: {
                hidden: true,
            },
        },
        {
            key: 'regressionInfoId',
            displayName: 'Regression Info Id',
            sortable: true,
            template: (details: any, row: any) => (
                <div onClick={() => copyToClipboard(row.rowData.regressionInfoId)} id='id-copy-container'> {details} </div>
            ),
        },
        {
            key: 'field',
            displayName: 'Field Name',
            sortable: true,
        },
        {
            key: 'diffType',
            displayName: 'Diff Type',
            sortable: true
        },
        {
            key: 'referenceValue',
            displayName: 'Reference Value',
            sortable: true,
        },
        {
            key: 'comparableValue',
            displayName: 'Comparison Value',
            sortable: true,
        },
        {
            key: 'paymentBatchId',
            sortable: true,
            displayName: 'Payment Batch',
            template: (details: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined, row: { rowData: { expanded: boolean | undefined; }; }) => (
                <Icon icon={'Document'} onClick={() => handleEobOpen(row)} id='icon--document' />
            ),

        },
        // Enable the below code If needs to show those columns
        // {
        //     key: 'paymentBatchId2',
        //     sortable: true,
        //     displayName: 'Payment BatchId V2',
        //     template: (details: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined, row: { rowData: { expanded: boolean | undefined; }; }) => (
        //         <>
        //             <Icon icon={'Document'} onClick={() => handleEobOpen(row)} id='icon--document' />
        //         </>
        //     ),
        // },
        // {
        //     key: 'context',
        //     displayName: 'Context',
        //     sortable: true,
        //     template:  (details: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined, row: { rowData: { expanded: boolean | undefined; }; }) => (
        //         <ContextComponent/>
        //     ),
        // },
        {
            key: 'details',
            displayName: '',
            header: {
                props: {
                    hidden: true,
                },
            },
            cell: {
                props: {
                    ['data-details']: 'true',
                },
            },
            template: (details: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined, row: { rowData: { expanded: boolean | undefined; }; }) => (
                <ShowHide show={row.rowData.expanded}>
                    <div className="fe_c_table__expanded-details">{details}</div>
                </ShowHide>
            ),
        },
    ];

    const [columns, setColumns] = useState(tableColumns);


    // This is a little tricky code to get the grouping functionality in UI. Recursively construct the tables to display one inside another table
    const constructTable = (groupedItems: any, groupByProps: string[], nestedTableLevel: number, navigator: string): any => {
        if (groupByProps.length == nestedTableLevel) {
            // groupedItems['values'] holds the rowsData of table on that nestedtableLevel
            return [<div id='inner-comp-table' key={nestedTableLevel}><ComparisonResultTable tableData={groupedItems['values']} tableColumns={tableColumns} dataLoaded={load !== 'loading'} /></div>, groupedItems['values'].length];
        }
        // groupByColumn holds the grouping values which user selected on the Select field. 
        // When there are multiple values, we use the values one by one to group, construct the table and nest it one inside another as `details` column's value
        const groupByColumn = groupByProps[nestedTableLevel];
        // If the data is grouped by `status`, then the column would be `status`. Constructing the column for table with that respective grouped value and with default columns.
        const InnerTableColumn = constructColumn(groupByColumn);
        const InnerTableRowandSize = constructRow(groupedItems, groupByColumn, nestedTableLevel, groupByProps, navigator);
        const row = InnerTableRowandSize[0];
        return [<div id='inner-comp-table' key={nestedTableLevel}><ComparisonResultTable tableData={row} tableColumns={InnerTableColumn} dataLoaded={load !== 'loading'} /></div>, InnerTableRowandSize[1]];
    }

    // construct columns with input column name along with default columns to show collapse and expand
    const constructColumn = (columnName: string): any => {
        const column = [
            {
                key: 'expanded',
                displayName: '',
                template: (expanded: any, row: { rowData: { id: any; }; }) => (
                    <Button
                        icon={expanded ? 'Collapse' : 'Expand'}
                        text={expanded ? 'Collapse' : 'Expand'}
                        variant="tertiary"
                        onClick={() => handleToggleDetailRow(row.rowData)}
                    />
                ),
            },
            {
                key: columnName,
                displayName: columnName,
                sortable: true,
            },
            {
                key: 'details',
                displayName: '',
                header: {
                    props: {
                        hidden: true,
                    },
                },
                cell: {
                    props: {
                        ['data-details']: 'true',
                    },
                },
                template: (details: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined, row: { rowData: { expanded: boolean | undefined; }; }) => (
                    <ShowHide show={row.rowData.expanded}>
                        <div className="fe_c_table__expanded-details">{details}</div>
                    </ShowHide>
                ),
            },
        ];
        return column;
    }

    const constructRow = (groupedItems: object | any, columnName: string, nestedTableLevel: number, groupByProps: string[], navigator: string): any => {
        const innerRows: any[] = [];
        let dataSize = 0;
        Object.entries(groupedItems).forEach(([key, value]: [string, any], index) => {
            // Random Id for Each inner nesting tables
            const newRowId = key + String(Math.floor(Math.random() * 60000) + 1);
            // Call constructTable again, bcz In the grouping logic, Each row have the table which is collapsed by default and shows table when expanded
            // constructing table with already grouped data and giving it to row
            const inTableData = constructTable(groupedItems[key], groupByProps, (nestedTableLevel + 1), (navigator + seperator + newRowId));
            const inTableJSX = inTableData[0];
            const dataSizeForAGroupedColumn = inTableData[1];
            dataSize += inTableData[1];
            // id, name, expanded. details, dataSize, navigator are the table columns, we are assigning values here
            // navigator id helps to navigate the table, If there are 2 tables, the inner table holds the outer tables Ids seperated by delimiter `///`
            const row: any = {
                id: newRowId,
                expanded: false,
                details: inTableJSX,
                dataSize: dataSizeForAGroupedColumn,
                navigator: { navigator }
            }
            // setting the data size on that group
            row[columnName] = key + '(' + dataSizeForAGroupedColumn + ')';
            innerRows.push(row);
        });
        // formed inner tables, set in rows, sending that row back to set in outer table
        return [innerRows, dataSize];
    };

    // function to group the rowData, later use it to populate in the table recursively
    const groupedValues = {};
    function groupRowDataBySelectedGrouping<T>(rowData: comparisonResultType[], groupByCategory: string[]): object {
        rowData.forEach(data => {
            let temp: map = {};
            groupByCategory.forEach((property, index, arr) => {
                const value = String(data[property]);
                if (index == 0) {
                    temp = groupedValues;
                }
                temp[value] = temp[value] ? temp[value] : arr.length - 1 == index ? { 'values': [] } : {};
                temp = temp[value];
            })
            temp['values'].push(data);
        });
        return groupedValues;
    }

    // Logic to convert the grouping category from combined string to string[]
    const checkAndSplitValue = (value: string | string[]): string[] => {
        const selectedValues: string[] = typeof value === 'string' ? value.split(',') : value;
        return selectedValues;
    }

    // function to triggered when the grouping category is changed
    const handleGrouping = (event: SelectChangeEvent<typeof groupingCategory>): any => {
        let { target: { value } } = event;
        value = checkAndSplitValue(value);
        // Resetting the table values and grouping category values when none selected in grouping
        if (value.length === 0) {
            setRows(initialData);
            setGroupingCategory(value);
            setColumns(tableColumns);
            return;
        }
        // starts grouping logic
        setGroupingCategory(value);
        // filter the search text on the rowData, group it by selected value and
        // construct the table from result
        let dataToGroup = searchTextOnRow(initialData, searchText);
        const groupedValues = groupRowDataBySelectedGrouping(dataToGroup, value);
        // Initiating constructing table
        const finalTable = constructTable(groupedValues, value, 0, '')[0];
        const tempRowValues = finalTable?.props.children.props.tableData;
        setColumns(finalTable?.props.children.props.tableColumns);
        setRows(tempRowValues);
    };

    // filter - match text on the data and return result
    function searchTextOnRow(dataToSearch: comparisonResultType[], searchVal: string) {
        let filteredValue: any[] = dataToSearch;
        if (searchVal !== null && searchVal !== '') {
            filteredValue = dataToSearch.filter(data => {
                const rowValue: string = JSON.stringify(data).toLowerCase();
                if (rowValue.includes(searchVal)) {
                    return true;
                }
            });
        }
        return filteredValue;
    }

    // function handle for search bar
    function handleSearch(event: ChangeEvent<HTMLInputElement>): void {
        const searchVal = event.target.value;
        setSearchText(searchVal);
        let filteredValue = searchTextOnRow(initialData, searchVal);
        // Also applying grouping after filtering
        if (groupingCategory.length > 0) {
            const groupedValues = groupRowDataBySelectedGrouping(filteredValue, groupingCategory);
            const finalTable = constructTable(groupedValues, groupingCategory, 0, '')[0];
            filteredValue = finalTable?.props.children.props.tableData;
            setColumns(finalTable?.props.children.props.tableColumns);
        }
        setRows(filteredValue);
    }

    return (
        <div className="comp-page">
            <div className="com-page__header">
                <PageHeader
                    title="Regression Result"
                    pageActions={
                        <React.Fragment>
                            <Tooltip title="Refresh Table" placement="top-start">
                                <IconButton size="large" id='btn--refresh' sx={{ padding: '0.3rem', marginRight: '0.3rem', cursor: 'pointer' }} onClick={fetchComparisonData}>
                                    <LoopIcon />
                                </IconButton>
                            </Tooltip>
                            <Link to={`/regression/report/${regressionId}`} className="link">
                                <MuiButton variant="contained" color="primary" style={{ color: 'white' }}>
                                    {'Regression Report'}
                                </MuiButton>
                            </Link>
                        </React.Fragment>
                    }
                />
            </div>
            <div className='comp-tab-container'>
                <Loader loading={load === 'loading'} text="Loading content...">
                    <div className='comp-tab__filters'>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="demo-multiple-chip-label">Grouping</InputLabel>
                            <Select
                                className='select--grouping-category'
                                labelId="demo-multiple-chip-label"
                                multiple
                                value={groupingCategory}
                                onChange={handleGrouping}
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.1 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {groupingColumns.map((category) => (
                                    <MenuItem
                                        key={category}
                                        value={category}
                                        style={getStyles(category, groupingColumns, theme)}
                                    >
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <input
                            type="text"
                            className="comp-tab__search-bar"
                            placeholder="Filter..."
                            onChange={handleSearch}
                            value={searchText}
                        />
                    </div>
                    <div id='comp-table'>
                        <ComparisonResultTable
                            tableData={rows}
                            tableColumns={columns}
                            dataLoaded={load !== 'loading'} />
                    </div>
                </Loader>

            </div>
        </div>
    );
}

function openEobOnNewTab(eobData: { contextId: string; paymentBatchId: string; }) {
    if (eobData) {
        let eob_external_url = `https://fps-rdp-external-alb-int-2098357946.us-east-1.elb.amazonaws.com/remitdocs/v1/contexts/${eobData.contextId}/paymentbatches/${eobData.paymentBatchId}/pdf`;
        window.open(eob_external_url, '_blank');
    }
}
