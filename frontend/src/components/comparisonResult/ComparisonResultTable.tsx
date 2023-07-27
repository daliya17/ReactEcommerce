import { Table } from "@athena/forge";
import React from "react";
import '../../style/css/ComparisonResultTable.css';

function ComparisonResultTable({ tableData, tableColumns, dataLoaded }:
  { tableData: any, tableColumns: any, dataLoaded: boolean }): any {

  // renderers to design the rows and headers
  let odd = false;
  const headerRowRenderer = ({ children }: { children: any }) => {
    const childArr = React.Children.toArray(children);
    const props = { children: childArr.filter((child: any) => !child.props.hidden) };
    return <tr id="forge-table__header"{...props} />;
  };

  const bodyRowRenderer = ({ children }: { children: any }): any => {
    const childArr = React.Children.toArray(children);
    const props = { children: childArr.filter((child: any) => !child.props['data-details']) };
    const detailCol: any = childArr.find((child: any) => child.props['data-details']);
    let className = 'fe_c_table-row--no-border ';
    className += odd ? ' odd_rows' : 'even_rows';
    odd = !odd;
    return (
      <>
        <tr {...props} className={className} id='forge-table__row' />
        <tr>{React.cloneElement(detailCol, { colSpan: '4', className: 'fe_u_padding--none' })}</tr>
      </>
    );
  };

  const TableWrapper = (): any => {
    return (
      <div className="forge-table__container">
        {!dataLoaded ? (<></>) : tableData.length > 0 ?
          (<Table
            className="forge-table"
            columns={tableColumns}
            rows={tableData}
            renderers={{
              header: {
                row: headerRowRenderer,
              },
              body: {
                row: bodyRowRenderer,
              },
            }}
            showHover={false}
          />) : <span id="no-data-notification">No Data Present To Display</span>
        }
      </div>
    );
  };

  return <TableWrapper />;
}

export default ComparisonResultTable;