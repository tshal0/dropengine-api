import { AppMetadataAuthorization } from "./AppMetadataAuthorization";

export interface Auth0AppMetadata {
  authorization?: AppMetadataAuthorization;
  roles?: string[];
  accounts: any[];
}
