import { statusBadRequest } from "../constants/response.status.constant";

export function errorResponse(message: string, status = statusBadRequest) {
  return { status, message };
}
