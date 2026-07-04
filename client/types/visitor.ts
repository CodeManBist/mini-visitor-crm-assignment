export interface Visitor {
  _id: string;
  visitorName: string;
  phone: string;
  personToMeet: string;
  purpose: string;
  checkInTime: string;
  checkOutTime: string | null;
  isCheckedOut: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface VisitorInput {
  visitorName: string;
  phone: string;
  personToMeet: string;
  purpose: string;
}