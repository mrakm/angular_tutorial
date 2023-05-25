export const GLOBALS = {
  pageActions: { create: 'create', view: 'view', update: 'update' },

  deleteDialog: {
    width: '350px',
    message: 'Are you sure you want to delete it?',
    alertMessage: 'This Record cannot be deleted',
    title: 'Warning!'
  },

  jobStartDialog: {
    width: '350px',
    message: 'Are you sure you want to Start the Job?',
    title: 'Warning!'
  },

  jobEndDialog: {
    width: '350px',
    message: 'Are you sure you want to End the Job?',
    title: 'Warning!'
  },

  formDialog: {
    width: '65vw'
  },

  designationConfirmDialog: {
    width: '350px',
    message: 'Are you sure? All the below values will be filled with new ones of the selected designation?',
    title: 'Warning!'
  },
  displayARecordDialog: {
    width: '500px'
  },
  masks: {
    mobile: [/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    contact: [/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    cnic: [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/],
    zip: [/[0-9]/, /\d/, /\d/, /\d/, /\d/],
    time: [/[0-9]/, /\d/, ':', /\d/, /\d/],
    yearMonth: [/[0-9]/, /\d/],
    year: [/[0-9]/, /\d/, /\d/, /\d/]
  },
  weekDays: [
    { dayId: 'MON', name: 'Monday', abbreviation: 'mon' },
    { dayId: 'TUE', name: 'Tuesday', abbreviation: 'tue' },
    { dayId: 'WED', name: 'Wednesday', abbreviation: 'wed' },
    { dayId: 'THR', name: 'Thursday', abbreviation: 'thr' },
    { dayId: 'FRI', name: 'Friday', abbreviation: 'fri' },
    { dayId: 'SAT', name: 'Saturday', abbreviation: 'sat' },
    { dayId: 'SUN', name: 'Sunday', abbreviation: 'sun' }
  ],

  /**
   * Data Grid / Data Table Settings
   *
   */
  dataTable: {
    pageSize: 25,
    pageSizeOptions: [25, 50, 100]
  },

  /**
   * months
   */

  MONTHS: [
    {
      number: 1,
      name: 'January',
      abbreviation: 'JAN'
    },
    {
      number: 2,
      name: 'Febuary',
      abbreviation: 'FEB'
    },
    {
      number: 3,
      name: 'March',
      abbreviation: 'MAR'
    },
    {
      number: 4,
      name: 'April',
      abbreviation: 'APR'
    },
    {
      number: 5,
      name: 'May',
      abbreviation: 'MAY'
    },
    {
      number: 6,
      name: 'June',
      abbreviation: 'JUN'
    },
    {
      number: 7,
      name: 'July',
      abbreviation: 'JUL'
    },
    {
      number: 8,
      name: 'August',
      abbreviation: 'AUG'
    },
    {
      number: 9,
      name: 'Sepetember',
      abbreviation: 'SEP'
    },
    {
      number: 10,
      name: 'October',
      abbreviation: 'OCT'
    },
    {
      number: 11,
      name: 'November',
      abbreviation: 'NOV'
    },
    {
      number: 12,
      name: 'December',
      abbreviation: 'DEC'
    }
  ],
  /**
   * Gender
   */
  gender: ['Male', 'Female', 'Other'],
  paymentType: ['Cash', 'Balance'],
  relation: ['S/O', 'D/O', 'H/O', 'W/O'],
  employeeFor: ['Lab', 'Hospital', 'Pharmacy'],
  religion: ['Muslim', 'Christian', 'Hindu'],
  category: ['Part Time', 'Full Time', 'Other'],
  employmentType: ['Probation', 'Contract', 'Confirmed', 'Ad hoc'],
  bloodGroup: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'],
  designationCategories: ['Consultant', 'Surgeon', 'General Practitioner', 'Other'],
  salaryTypes: ['Basic Salary', 'Session Wise', 'Per Hour'],
  maritalStatus: ['Single', 'Married', 'Widow', 'Divorced'],
  modeOfPayments: ['Cash', 'Bank', 'Misc'],
  Priority: ['High', 'Normal', 'Low'],

  purchaseRequestStatus: {
    draft: 'Draft',
    dispatch: 'Dispatch',
    approved: 'Approved',
    partialApproved: 'Partial Approved',
    issued: 'Issued',
    partialIssued: 'Partial Issued',
    requested: 'Requested'
  },

  rosterMonths: [
    {
      number: 1,
      name: 'Dec - Jan'
    },
    {
      number: 2,
      name: 'Jan - Feb'
    },
    {
      number: 3,
      name: 'Feb - Mar'
    },
    {
      number: 4,
      name: 'Mar - Apr'
    },
    {
      number: 5,
      name: 'Apr - May'
    },
    {
      number: 6,
      name: 'May - Jun'
    },
    {
      number: 7,
      name: 'Jun - Jul'
    },
    {
      number: 8,
      name: 'Jul - Aug'
    },
    {
      number: 9,
      name: 'Aug - Sep'
    },
    {
      number: 10,
      name: 'Sep - Oct'
    },
    {
      number: 11,
      name: 'Oct - Nov'
    },
    {
      number: 12,
      name: 'Nov - Dec'
    }
  ],

  rosterYears: ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028'],
  roomTypes: ['Option 1', 'Option 2', 'Option 3'],

  voucherTypes: ['JV', 'CPV', 'CRV', 'BPV', 'BRV', 'PV', 'SV', 'OP', 'ES', 'DS', 'OS'],
  currency: [
    { name: 'PKR', rate: 1.0 },
    { name: 'USD', rate: 174.4 },
    { name: 'AUD', rate: 123.32 }
  ]
};

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum MartialStatus {
  Single = 'Single',
  Married = 'Married',
  Divorced = 'Divorced',
  Widowed = 'Widowed'
}
