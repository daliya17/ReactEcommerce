import React from 'react';
import { Tooltip, withStyles } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/InfoOutlined';

const styles = {
  popper: {
    opacity: 1,
    zIndex: 2000
  },
  tooltip: {
    borderRadius: '2px',
    padding: '10px 15px 10px 15px',
    fontSize: '13px',
    color: '#E0E0E0'
  },
  icon: {
    fontSize: '15px',
    marginLeft: '5px'
  },
  margin: {
    margin: '10px'
  }
};

const tableHeader = ({ classes, label, title }) => (
  <React.Fragment>
    <span>{label}</span>
    <Tooltip
      classes={{
        tooltip: classes.tooltip,
        popper: classes.popper
      }}
      title={title}
    >
      <InfoIcon className={classes.icon} />
    </Tooltip>
  </React.Fragment>
);

export const TableHeader = withStyles(styles)(tableHeader);

const tableHeaderInfo = fieldsConsidered => {
  return (
    <div>
      <div>{'Percentage is calculated using the following fields.'}</div>
      <div style={{ margin: '10px' }}>
        <i>{'( ' + fieldsConsidered + ' ) / All_Fields'}</i>
      </div>
      <div>
        {
          'where All_Fields = ( Matched + Added + Different + Removed + Ignored )'
        }
      </div>
    </div>
  );
};

export const getScoreColumns = (allColumns = false) => {
  let columns = [
    {
      id: 'score',
      label: (
        <TableHeader
          label="Score %"
          title={tableHeaderInfo('Matched + Added + Ignored')}
        />
      ),
      width: '10px',
      numeric: true
    }
  ];

  if (allColumns) {
    columns = [
      ...columns,
      {
        id: 'matchedPercentage',
        label: (
          <TableHeader
            label="Matched %"
            title={tableHeaderInfo('Matched + Ignored')}
          />
        ),
        numeric: true
      },
      {
        id: 'addedPercentage',
        label: <TableHeader label="Added %" title={tableHeaderInfo('Added')} />,
        numeric: true
      },
      {
        id: 'removedPercentage',
        label: (
          <TableHeader label="Removed %" title={tableHeaderInfo('Removed')} />
        ),
        numeric: true
      },
      {
        id: 'differentPercentage',
        label: (
          <TableHeader
            label="Different %"
            title={tableHeaderInfo('Different')}
          />
        ),
        numeric: true
      }
    ];
  }

  return columns;
};
