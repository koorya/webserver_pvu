export interface iPlcVar {
  id: number;
  type: 'int' | 'float' | 'bool';
  name: string;
  value: any
}