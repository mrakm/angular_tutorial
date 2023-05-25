export let GLOBALS = {
  connection: null,

  GDataObject: {},

  SECRET: 'DOERS_LETS_DO_THE_WONDERFUL',

  PUBLIC_URLS: [`/authenticaion/users/login`, `/authenticaion/users/create`, `/project/findAll`],
};

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum MartialStatus {
  Single = 'Single',
  Married = 'Married',
  Divorced = 'Divorced',
  Widowed = 'Widowed',
}
