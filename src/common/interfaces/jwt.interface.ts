export interface JwtPayload {
  _id: string;
  email: string;
  role?: string;
  type?: string;
  deviceId?: string;
}
