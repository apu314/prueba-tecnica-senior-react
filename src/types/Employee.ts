export interface Employees {
  "//": string;
  data: Employee[];
}

export interface Employee {
  id:                 number;
  first_name:         string;
  last_name:          string;
  total_holidays:     number;
  daysOff?:           [number];
}
