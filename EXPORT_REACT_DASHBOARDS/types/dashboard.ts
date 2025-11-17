export interface ChartDataPoint {
  month: string;
  value: number;
  highlight?: boolean;
}

export interface SatisfactionDataPoint {
  month: string;
  satisfied: number;
  neutral: number;
  unsatisfied: number;
}

export interface ExpenseDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface BarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  payload: ChartDataPoint;
}