import { AppMetadataAuthorization } from './AppMetadataAuthorization';

export interface Auth0AppMetadata {
  authorization?: AppMetadataAuthorization;
  companies?: string[];
  merchants?: string[];
  manufacturers?: string[];
  sellers?: string[];
  primary_user_id: string;
  roles?: string[];
}
