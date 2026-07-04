export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerInput {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "Active" | "Inactive";
}