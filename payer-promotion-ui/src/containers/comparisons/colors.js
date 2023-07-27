import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';
import FieldStatuses from '../../constants/FieldStatuses';

export const backgroundColors = {
  addedBg: {
    backgroundColor: green[100]
  },
  differentBg: {
    backgroundColor: orange[100]
  },
  removedBg: {
    backgroundColor: red[100]
  },
  sameBg: {
    backgroundColor: 'white'
  },
  ignoredBg: {
    backgroundColor: grey[200]
  },
  blankBg: {
    backgroundColor: grey[200]
  }
};

export const backgroundColorStatusMappings = {
  [FieldStatuses.Matched]: 'sameBg',
  [FieldStatuses.Added]: 'addedBg',
  [FieldStatuses.Different]: 'differentBg',
  [FieldStatuses.Removed]: 'removedBg',
  [FieldStatuses.Ignored]: 'ignoredBg',
  [FieldStatuses.Blank]: 'blankBg'
};

export const textColors = {
  addedTxt: {
    color: green[700]
  },
  removedTxt: {
    color: red[700]
  },
  differentTxt: {
    color: orange[700]
  },
  greyedoutTxt: {
    color: grey[500],
    'font-style': 'italic'
  }
};

export const toggleBars = {
  matchedSwitchBase: {
    color: 'white',
    '&$matchedColorChecked': {
      color: 'white',
      '& + $matchedColorBar': {
        backgroundColor: '#ccc'
      }
    }
  },
  matchedColorChecked: {},
  matchedColorBar: {},
  addedSwitchBase: {
    color: green[300],
    '&$addedColorChecked': {
      color: green[500],
      '& + $addedColorBar': {
        backgroundColor: green[500]
      }
    }
  },
  addedColorChecked: {},
  addedColorBar: {},
  diffSwitchBase: {
    color: orange[300],
    '&$diffColorChecked': {
      color: orange[500],
      '& + $diffColorBar': {
        backgroundColor: orange[500]
      }
    }
  },
  diffColorChecked: {},
  diffColorBar: {},
  removedSwitchBase: {
    color: red[300],
    '&$removedColorChecked': {
      color: red[500],
      '& + $removedColorBar': {
        backgroundColor: red[500]
      }
    }
  },
  removedColorChecked: {},
  removedColorBar: {},
  ignoredSwitchBase: {
    color: grey[300],
    '&$ignoredColorChecked': {
      color: grey[500],
      '& + $ignoredColorBar': {
        backgroundColor: grey[500]
      }
    }
  },
  ignoredColorChecked: {},
  ignoredColorBar: {},
  blankSwitchBase: {
    color: grey[300],
    '&$blankColorChecked': {
      color: grey[500],
      '& + $blankColorBar': {
        backgroundColor: grey[500]
      }
    }
  },
  blankColorChecked: {},
  blankColorBar: {}
};
