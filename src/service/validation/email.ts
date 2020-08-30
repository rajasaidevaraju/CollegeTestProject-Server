import Validator from "validator";
import isEmpty from "is-empty";
import { EmailErrorConfig } from "./ErrorConfig";
export function validateEmailInput(data: any): EmailErrorConfig {
  let errors: EmailErrorConfig = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  return errors;
}
