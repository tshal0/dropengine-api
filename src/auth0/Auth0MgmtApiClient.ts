/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, Logger, NotImplementedException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";

import { catchError, lastValueFrom, map, of } from "rxjs";
import { Auth0ResourceServer } from "./dto/Auth0ResourceServer";
import { Auth0CreateRolePayload } from "./dto/Auth0CreateRolePayload";
import { Auth0RolesPayload } from "./dto/Auth0RolesPayload";
import { Auth0Role } from "./dto/Auth0Role";
import { Auth0AppMetadataPayload } from "./dto/Auth0AppMetadataPayload";
import { Auth0PermissionsPayload } from "./dto/Auth0PermissionsPayload";
import { Auth0User, IAuth0User } from "./domain/Auth0ExtendedUser";
import { AzureTelemetryService } from "@shared/modules";

export interface PaginatedAuth0UserResponse {
  start: number;
  limit: number;
  length: number;
  users: IAuth0User[];
}
interface IAuth0GetPaginatedUsersResponseDto {
  length: number;
  limit: number;
  start: number;
  total: number;
  users: IAuth0User[];
}
export interface IAuth0MgmtApiClient {
  getUsersByEmail(email: string): Promise<IAuth0User[]>;
}

@Injectable()
export class Auth0MgmtApiClient implements IAuth0MgmtApiClient {
  private readonly logger: Logger = new Logger(Auth0MgmtApiClient.name);

  constructor(private http: HttpService) {}
  async getAdminByEmail(): Promise<Auth0User> {
    let users = await this.getUsersByEmail(`thomas@drop-engine.com`);
    let user = users[0];
    return user;
  }
  async getUsersByEmail(email: string): Promise<Auth0User[]> {
    const resp$ = await this.http
      .get(`/api/v2/users-by-email?email=${email}`)
      .pipe(
        map((r) => r.data as IAuth0User[]),
        catchError((e) => {
          return this.handleArrayAuth0MgmtApiError<IAuth0User>(e);
        })
      );
    const resp = await lastValueFrom(resp$);
    const users = resp.map((user) => Auth0User.from(user));
    return users;
  }
  async createUser(user: Auth0User, password: string): Promise<Auth0User> {
    const props = user.props();

    const payload = {
      ...props,
      connection: "Username-Password-Authentication",
      password: password,
    };
    this.logger.debug(JSON.stringify({ payload }, null, 2));
    const resp$ = await this.http
      .post(`/api/v2/users`, {
        ...payload,
      })
      .pipe(
        map((r) => r.data as IAuth0User),
        catchError((e) => {
          return this.handleAuth0MgmtApiError<IAuth0User>(e);
        })
      );
    const resp = await lastValueFrom(resp$);
    return Auth0User.from(resp);
  }

  async fetchUsersPage(page: number): Promise<PaginatedAuth0UserResponse> {
    await this.guardAuth0Enabled();
    const resp$ = await this.http
      .get(
        `/api/v2/users?per_page=100&include_totals=true&fields=identities&include_fields=false&page=${page}`
      )
      .pipe(
        map((r) => r.data as PaginatedAuth0UserResponse),
        catchError((e) => {
          return this.handleAuth0MgmtApiError<PaginatedAuth0UserResponse>(e);
        })
      );
    const resp = await lastValueFrom(resp$);
    return resp;
  }

  async fetchAllUsers(): Promise<IAuth0User[]> {
    await this.guardAuth0Enabled();
    let users = [] as IAuth0User[];
    let page = 0;
    let resp: PaginatedAuth0UserResponse = {
      length: 0,
      limit: 0,
    } as PaginatedAuth0UserResponse;
    while (resp.limit == resp.length) {
      resp = await this.fetchUsersPage(page);
      users = users.concat(resp.users);
      page++;
    }
    return users;
  }

  async getUser(id: string): Promise<IAuth0User> {
    await this.guardAuth0Enabled();
    const resp$ = await this.http.get(`/api/v2/users/${id}`).pipe(
      map((r) => r.data as IAuth0User),
      catchError((e) => {
        return this.handleAuth0MgmtApiError<IAuth0User>(e);
      })
    );
    const resp = await lastValueFrom(resp$);
    return resp;
  }
  async deleteUser(id: string): Promise<any> {
    await this.guardAuth0Enabled();
    const resp$ = await this.http.delete(`/api/v2/users/${id}`).pipe(
      map((r) => r.data as IAuth0User),
      catchError((e) => {
        return this.handleAuth0MgmtApiError<IAuth0User>(e);
      })
    );
    const resp = await lastValueFrom(resp$);
    return resp;
  }
  async patchUserAppMetadata(
    id: string,
    app_metadata: Auth0AppMetadataPayload
  ): Promise<IAuth0User> {
    await this.guardAuth0Enabled();
    const resp$ = await this.http
      .patch(`/api/v2/users/${id}`, { app_metadata: app_metadata })
      .pipe(
        map((r) => r.data as IAuth0User),
        catchError((e) => {
          return this.handleAuth0MgmtApiError<IAuth0User>(e);
        })
      );
    const resp = await lastValueFrom(resp$);
    return resp;
  }
  async getAccountUsers(
    accountId: string,
    page: number
  ): Promise<IAuth0User[]> {
    const resp$ = await this.http
      .get(
        `/api/v2/users?q=app_metadata.accounts.id:"${accountId}"&per_page=100&include_totals=true&fields=identities&include_fields=false&page=${page}`
      )
      .pipe(
        map((r) => r.data as IAuth0GetPaginatedUsersResponseDto),
        catchError((e) => {
          return this.handleAuth0MgmtApiError<IAuth0GetPaginatedUsersResponseDto>(
            e
          );
        })
      );
    const resp = await lastValueFrom(resp$);
    return resp.users;
  }
  // async getResourceServers(): Promise<Auth0ResourceServer[]> {
  //   await this.guardAuth0Enabled();
  //   const resp$ = await this.http.get(`/api/v2/resource-servers`).pipe(
  //     map((r) => r.data as Auth0ResourceServer[]),
  //     catchError((e) => {
  //       return this.handleAuth0MgmtApiError<Auth0ResourceServer[]>(e);
  //     })
  //   );
  //   const resp = await lastValueFrom(resp$);
  //   return resp;
  // }
  // async getResourceServer(id: string): Promise<Auth0ResourceServer> {
  //   await this.guardAuth0Enabled();
  //   const resp$ = await this.http.get(`/api/v2/resource-servers/${id}`).pipe(
  //     map((r) => r.data as Auth0ResourceServer),
  //     catchError((e) => {
  //       return this.handleAuth0MgmtApiError<Auth0ResourceServer>(e);
  //     })
  //   );
  //   const resp = await lastValueFrom(resp$);
  //   return resp;
  // }

  // async patchResourceServer(
  //   id: string,
  //   payload: Auth0ResourceServer
  // ): Promise<any> {
  //   await this.guardAuth0Enabled();
  //   const resp$ = await this.http
  //     .patch(`/api/v2/resource-servers/${id}`, payload)
  //     .pipe(
  //       map((r) => r.data as Auth0ResourceServer),
  //       catchError((e) => {
  //         return this.handleAuth0MgmtApiError<Auth0ResourceServer>(e);
  //       })
  //     );
  //   const resp = await lastValueFrom(resp$);
  //   return resp;
  // }
  // async getRoles(): Promise<Auth0Role[]> {
  //   await this.guardAuth0Enabled();
  //   const resp$ = await this.http.get(`/api/v2/roles`).pipe(
  //     map((r) => r.data as Auth0Role[]),
  //     catchError((e) => {
  //       return this.handleArrayAuth0MgmtApiError<Auth0Role>(e);
  //     })
  //   );
  //   const resp = await lastValueFrom(resp$);
  //   return resp;
  // }
  // async getRole(id: string): Promise<Auth0Role> {
  //   await this.guardAuth0Enabled();
  //   const resp$ = await this.http.get(`/api/v2/roles/${id}`).pipe(
  //     map((r) => r.data as Auth0Role),
  //     catchError((e) => {
  //       return this.handleAuth0MgmtApiError<Auth0Role>(e);
  //     })
  //   );
  //   const resp = await lastValueFrom(resp$);
  //   return resp;
  // }
  // async createRole(payload: Auth0CreateRolePayload): Promise<Auth0Role> {
  //   await this.guardAuth0Enabled();
  //   const resp$ = await this.http.post(`/api/v2/roles`, payload).pipe(
  //     map((r) => r.data as Auth0Role),
  //     catchError((e) => {
  //       return this.handleAuth0MgmtApiError<Auth0Role>(e);
  //     })
  //   );
  //   const resp = await lastValueFrom(resp$);
  //   return resp;
  // }
  // async deleteRole(id: string): Promise<{}> {
  //   await this.guardAuth0Enabled();
  //   const resp$ = await this.http.delete(`/api/v2/roles/${id}`).pipe(
  //     map((r) => r.data),
  //     catchError((e) => {
  //       return this.handleAuth0MgmtApiError<any>(e);
  //     })
  //   );
  //   const resp = await lastValueFrom(resp$);
  //   return resp;
  // }
  // async getRolePermissions(id: string): Promise<Auth0PermissionsPayload> {
  //   await this.guardAuth0Enabled();
  //   const resp$ = await this.http.get(`/api/v2/roles/${id}/permissions`).pipe(
  //     map((r) => r.data as Auth0PermissionsPayload),
  //     catchError((e) => {
  //       return this.handleAuth0MgmtApiError<Auth0PermissionsPayload>(e);
  //     })
  //   );
  //   const resp = await lastValueFrom(resp$);
  //   return resp;
  // }
  // async addRolePermissions(
  //   id: string,
  //   payload: Auth0PermissionsPayload
  // ): Promise<Auth0PermissionsPayload> {
  //   await this.guardAuth0Enabled();
  //   const resp$ = await this.http
  //     .post(`/api/v2/roles/${id}/permissions`, {
  //       permissions: payload.permissions,
  //     })
  //     .pipe(
  //       map((r) => r.data as Auth0PermissionsPayload),
  //       catchError((e) => {
  //         this.logger.log(`Auth0 AddRolePermissions ERROR`, e);
  //         return this.handleAuth0MgmtApiError<Auth0PermissionsPayload>(e);
  //       })
  //     );
  //   const resp = await lastValueFrom(resp$);
  //   return resp;
  // }
  // async removeRolePermissions(
  //   id: string,
  //   payload: Auth0PermissionsPayload
  // ): Promise<Auth0PermissionsPayload> {
  //   await this.guardAuth0Enabled();
  //   const resp$ = await this.http
  //     .delete(`/api/v2/roles/${id}/permissions`, { data: payload })
  //     .pipe(
  //       map((r) => r.data as Auth0PermissionsPayload),
  //       catchError((e) => {
  //         return this.handleAuth0MgmtApiError<Auth0PermissionsPayload>(e);
  //       })
  //     );
  //   const resp = await lastValueFrom(resp$);
  //   return resp;
  // }

  // async getUsersByTenant(
  //   tenant_code: string,
  //   page: number
  // ): Promise<IAuth0User[]> {
  //   await this.guardAuth0Enabled();
  //   const resp$ = await this.http
  //     .get(
  //       `/api/v2/users?q=app_metadata.companies:(${tenant_code})&per_page=100&include_totals=true&fields=identities&include_fields=false&page=${page}`
  //     )
  //     .pipe(
  //       map((r) => r.data as IAuth0User[]),
  //       catchError((e) => {
  //         return this.handleArrayAuth0MgmtApiError<IAuth0User>(e);
  //       })
  //     );
  //   const resp = await lastValueFrom(resp$);
  //   return resp;
  // }

  // async getUserRoles(id: string): Promise<Auth0Role[]> {
  //   await this.guardAuth0Enabled();
  //   const resp$ = await this.http.get(`/api/v2/users/${id}/roles`).pipe(
  //     map((r) => r.data as Auth0Role[]),
  //     catchError((e) => {
  //       return this.handleArrayAuth0MgmtApiError<Auth0Role>(e);
  //     })
  //   );
  //   const resp = await lastValueFrom(resp$);
  //   return resp;
  // }
  // async addUserRoles(
  //   id: string,
  //   payload: Auth0RolesPayload
  // ): Promise<Auth0Role[]> {
  //   await this.guardAuth0Enabled();
  //   const resp$ = await this.http
  //     .post(`/api/v2/users/${id}/roles`, { roles: [...payload.roles] }, {})
  //     .pipe(
  //       map((r) => r.data as Auth0Role[]),
  //       catchError((e) => {
  //         return this.handleArrayAuth0MgmtApiError<Auth0Role>(e);
  //       })
  //     );
  //   const resp = await lastValueFrom(resp$);
  //   return resp;
  // }
  // async removeUserRoles(
  //   id: string,
  //   payload: Auth0RolesPayload
  // ): Promise<Auth0Role[]> {
  //   await this.guardAuth0Enabled();
  //   const resp$ = await this.http
  //     .delete(`/api/v2/users/${id}/roles`, { data: payload })
  //     .pipe(
  //       map((r) => r.data as Auth0Role[]),
  //       catchError((e) => {
  //         return this.handleArrayAuth0MgmtApiError<Auth0Role>(e);
  //       })
  //     );
  //   const resp = await lastValueFrom(resp$);
  //   return resp;
  // }

  private handleAuth0MgmtApiError<T>(e: any) {
    this.logger.error(e.message, {
      url: `${e.config?.baseURL}${e.config?.url}`,
      method: e.config?.method,
      response: e?.response?.data,
    });

    return of({} as T);
  }
  private handleArrayAuth0MgmtApiError<T>(e: any) {
    this.logger.error(e.message, e.stack, {
      url: `${e.config?.baseURL}${e.config?.url}`,
      method: e.config?.method,
      response: e?.response?.data,
    });

    return of([] as T[]);
  }
  private async guardAuth0Enabled() {
    // const enabled = await this.ldClient.auth0Enabled();
    // if (!enabled) {
    //   throw new NotImplementedException(`Auth0 Integration Disabled`);
    // }
  }
}
