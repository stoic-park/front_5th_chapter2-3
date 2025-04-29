export interface Address {
  address: string
  city: string
  state: string
}

export interface Company {
  name: string
  title: string
}

export interface User {
  id: number
  username: string
  email: string
  phone: string
  image: string
  firstName: string
  lastName: string
  age: number
  address: Address
  company: Company
}
