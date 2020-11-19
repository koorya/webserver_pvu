import { iPlcVar } from "./iPlcVar";

export const plc_variables: iPlcVar[] = [
  {
    id: 1,
    type: "int",
    name: "state1",
    value: 0,
  },
  {
    id: 2,
    type: "float",
    name: "x",
    value: 2.4,
	},
	{
    id: 4,
    type: "float",
    name: "y",
    value: 5.2,
  },
  {
    id: 3,
    type: "bool",
    name: "enable",
    value: true,
  },
];