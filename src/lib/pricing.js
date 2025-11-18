import takbullConfig from "./takbull";

export const PRICES = [
  {
    id: "p-s1-a",
    type: takbullConfig.dealTypes.REGULAR,
    price: 110,
    classes: 1,
    validForMonths: 1,
  },
  {
    id: "p-s1-b",
    type: takbullConfig.dealTypes.REGULAR,
    price: 300,
    classes: 3,
    validForMonths: 1,
  },
  {
    id: "p-s2-a",
    type: takbullConfig.dealTypes.REGULAR,
    price: 160,
    classes: 1,
    validForMonths: 1,
  },
  {
    id: "p-s2-b",
    type: takbullConfig.dealTypes.REGULAR,
    price: 700,
    classes: 5,
    validForMonths: 2,
  },
  {
    id: "p-s3-1",
    type: takbullConfig.dealTypes.RECURRING,
    price: 500,
    classes: 1,
  },
  {
    id: "p-s3-2",
    type: takbullConfig.dealTypes.RECURRING,
    price: 920,
    classes: 2,
  },
  {
    id: "p-s3-3",
    type: takbullConfig.dealTypes.RECURRING,
    price: 1200,
    classes: 3,
  },
  {
    id: "p-s3-4",
    type: takbullConfig.dealTypes.RECURRING,
    price: 1600,
    classes: 6,
  },
];
