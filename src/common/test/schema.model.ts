import { Users } from "../../users/schemas/user.schema";
import { MockModel } from "./mock.model";

export class UserModel extends MockModel<Users> {
  protected entityStub: Users;
}
