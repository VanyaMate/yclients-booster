export const getTableData = function (tableData: string): Array<Array<string>> {
    return tableData.split('\n').map((row) => row.split('\t'));
};