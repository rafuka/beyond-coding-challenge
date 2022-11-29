import { CastingFunction, CastingContext } from 'csv-parse/sync';


export function convertToInteger(strNumber: string): number {
  const num: number = parseFloat(strNumber);

  if (strNumber.includes('M')) return num * 1000000;
  else if (strNumber.includes('K')) return num * 1000;
  
  return parseInt(strNumber);
}
  
export function castCSVNumberVals(columns: Array<string|number>): CastingFunction {
  return (colValue: string, context: CastingContext) => { 
    const { column } = context;

    if (columns.includes(column)) {
      return convertToInteger(colValue);
    }

    return colValue;
  }
}