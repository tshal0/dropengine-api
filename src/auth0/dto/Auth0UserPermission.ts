import { Auth0RolePermission } from "./Auth0RolePermission";
import { Auth0UserPermissionSource } from "./Auth0UserPermissionSource";


export interface Auth0UserPermission extends Auth0RolePermission {
  description: string;
  resource_server_name: string;
  sources: Auth0UserPermissionSource[];
}
