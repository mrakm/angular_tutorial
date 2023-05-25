export interface User {
  id: string;
  access_token: string;
  userName: string;
  isSuperUser: boolean;
  application: string;
  menu: any;
  employeeId?: string;
  projectId?: string;
}
