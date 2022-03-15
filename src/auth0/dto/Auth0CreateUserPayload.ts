import { Auth0AppMetadata } from "./Auth0AppMetadata";

export interface Auth0CreateUserPayload {
  email?: string;
  blocked?: boolean;
  email_verified?: boolean;
  app_metadata?: Auth0AppMetadata;
  password?: string;
  verify_email?: boolean;
  connection?: string;
}
