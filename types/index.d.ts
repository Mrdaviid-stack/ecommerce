export interface Auth {
  identity: string,
  password: string
}

export interface User {
  firstname: string
  lastname: string,
  email: string,
  username: string,
  password: string,
  status: string
  token: string,
}