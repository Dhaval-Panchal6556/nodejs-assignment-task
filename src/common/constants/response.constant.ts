export const RESPONSE_SUCCESS = {
  USER_LOGIN: "User Successfully Login",
  USER_LISTED: "Users Listed",
  USER_INSERTED: "User Created",
  USER_UPDATED: "User Updated",
  USER_DELETED: "User Deleted",
  RECORD_LISTED: "Records Listed",
  RECORD_INSERTED: "Record Inserted",
  RECORD_UPDATED: "Record Updated",
  RECORD_DELETED: "Record Deleted",
};

export const RESPONSE_ERROR = {
  USER_NOT_FOUND: "User not found",
  USER_ALREADY_EXIST: "User already exist with this email",
};

/*Common Msg*/
export const INVALID_EMAIL_FORMAT = "Invalid email format.";
export const INVALID_PASSWORD_FORMAT =
  "Password must be at least 8 characters long and contain at least 1 special character, 1 number, and 1 capital letter";
export const FORGOT_PASS_SUCC =
  "Reset Password link will be sent to your email. Please follow that link to reset your password.";
export const RESET_TOKEN_INVALID = "Your link has been expired";
export const RESET_PASS_SUCC = "Password reset successfully.";
export const MID_USER_ACC_DELETED =
  "Your Account has been deleted by an admin, Please visit Contact Us to contact an admin.";
export const MID_USER_ACC_INACTIVE =
  "Your Account has been deactivated by an Admin.";
export const USER_DOES_NOT_FOUND =
  "No account found with this email. Please check your email";
export const ACCOUNT_DISABLED = "Your account has been disabled by an admin.";
export const EMAIL_ALREADY_EXIST = "Email is already exist";

export const TASK_MSG = {
  TASK_ADDED_SUCC: "Task added successfully.",
  TASK_UPDATED_SUCC: "Task updated successfully.",
  TASK_LIST_SUCC: "Task list fetch successfully.",
  TASK_UPDATE_DETAILS_SUCC: "Task details updated successfully.",
  TASK_DELETE_SUCC: "Task deleted successfully.",
  TASK_NOT_FOUND: "Task is not found",
};

export const USER_MSG = {
  USER_SIGN_UP_SUCC: "User SignUp successfully",
  USER_SIGN_IN_SUCC: "User SignIn successfully",
  USER_GET_SUCC: "User details fetch successfully",
  USER_UPDATED_SUCC: "User updated successfully",
};

export const PROJECT_MSG = {
  PROJECT_ADDED_SUCC: "Project added successfully",
  PROJECT_UPDATED_SUCC: "Project updated successfully",
  PROJECT_VIEW_SUCC: "Project details fetch successfully",
  PROJECT_DELETED_SUCC: "Project deleted successfully",
  PROJECT_LIST_SUCC: "Project listed successfully",
  PROJECT_NOT_FOUND: "Project is not found",
  PROJECT_IS_NOT_LINKED: "This Project is not linked to your user account.",
};

/*Admin Msg*/
export const ADMIN_USER_ALREADY_LOADED = "Initial user already loaded.";
export const ADMIN_USER_ALREADY_LOADED_SUCC =
  "Initial user loaded successfully.";
export const ADMIN_LOGIN = "Admin logged in successfully";
export const ADMIN_NOT_FOUND = "Admin does not exist";
