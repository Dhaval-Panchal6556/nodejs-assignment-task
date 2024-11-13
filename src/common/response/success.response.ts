import { statusOk } from "../constants/response.status.constant";

export function successResponse(
  status = statusOk,
  message: string,
  data: unknown
) {
  return { status, message, data };
}
