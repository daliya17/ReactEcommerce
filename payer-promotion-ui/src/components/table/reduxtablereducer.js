import { ReduxTableActionTypes } from './reduxtableactions';

export default (tables = {}, action) => {
  const handlers = {
    [ReduxTableActionTypes.UPDATETABLE]: () => {
      const { tableName, tableData } = action;
      return {
        ...tables,
        [tableName]: tableData
      };
    }
  };

  const handler = handlers[action.type];
  return handler ? handler() : tables;
};
