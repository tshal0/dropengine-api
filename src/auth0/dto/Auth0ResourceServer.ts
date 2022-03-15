import { Auth0ResourceServerScope } from "./Auth0ResourceServerScope";


export interface Auth0ResourceServer {
  /**
   * * Field: id
   */
  id?: string;

  /**
   * * Field: name
   */
  name?: string;

  /**
   * * Field: identifier
   */
  identifier?: string;


  /**
   * * Field: scopes
   */
  scopes: Auth0ResourceServerScope[];
}
