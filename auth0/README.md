# Auth0

## Settings > General

- Name
  - DropEngine™ (Env)
- Logo URL
  - <https://sadropenginedev.blob.core.windows.net/images/drop-engine-logo-combo.png>
- Support Email
  - thomas@drop-engine.com
- API Auth Settings > Default Directory
  - `Username-Password-Authentication`

## APIs

### **Auth0 Management API**

- M2M
  - API Explorer
  - DropEngine API Postman Client (Dev)
  - DropEngine Management API (Dev)
    - Grant ALL scopes to the client

### **DropEngine API (Env)**

- Name: `DropEngine API (Dev)`
- Identifier: `dropengine.api.ENV`
- RBAC: `enabled`
- Add Permissiong to the Access Token
- Allow Offline Access
- M2M
  - DropEngine Management API (Dev)
  - DropEngine API Postman Client (Dev)

## Applications

- API Explorer
- Default App
- DropEngine API Postman Client (ENV)
  - Regular Web App
  - Logo: `https://sadropenginedev.blob.core.windows.net/images/drop-engine-logo-combo.png`
  - Auth Method: `POST`
  - Grant Types
    - Implicit
    - Auth Code
    - Refresh Token
    - Password
- DropEngine Management Client (ENV)
  - Machine to Machine
  - Auth Method: `POST`
  - Grant Types
    - Auth Code
    - Client Credentials
    - Password
  - APIs
    - Auth0 Management API `enabled`
    - DropEngine API (ENV) `enabled`
- DropEngine Portal (ENV)
  - SPA
  - Logo: `https://sadropenginedev.blob.core.windows.net/images/drop-engine-logo-icon.png`
  - Auth Method `None`
  - Callback URLs
    - `http://localhost:3002, https://dev.drop-engine.com`
  - Logout URLs
    - `https://dev.drop-engine.com, http://localhost:3002`
  - Web Origins
    - `http://localhost:3002, https://dev.drop-engine.com`
  - Refresh Token Rotation
  - Grant Types
    - Implicit
    - Auth Code
    - Refresh Token
    - Password

## Rules

- Settings.NAMESPACE: `https://www.drop-engine.com`

```javascript
function addEmailAndMetadataToAccessToken(user, context, callback) {
  // TODO: implement your rule
  var namespace = configuration.NAMESPACE;
  context.accessToken[namespace + "/email"] = user.email;
  context.accessToken[namespace + "/app_metadata"] = user.app_metadata;
  context.idToken[namespace + "/app_metadata"] = user.app_metadata;
  return callback(null, user, context);
}
```

Add Roles to Token

```javascript
function addRolesToToken(user, context, callback) {
  var namespace = configuration.NAMESPACE;
  const assignedRoles = (context.authorization || {}).roles;
  context.accessToken[namespace + "/roles"] = assignedRoles;
  callback(null, user, context);
}
```

Add Permissions To Token

```javascript
function (user, context, callback) {
  var map = require('array-map');
  var ManagementClient = require('auth0@2.17.0').ManagementClient;
  var management = new ManagementClient({
    token: auth0.accessToken,
    domain: auth0.domain
  });

  var params = { id: user.user_id, page: 0, per_page: 50, include_totals: true };
  management.getUserPermissions(params, function (err, permissions) {
    if (err) {
      // Handle error.
      console.log('err: ', err);
      callback(err);
    } else {
      var permissionsArr = map(permissions.permissions, function (permission) {
        return permission.permission_name;
      });
      context.idToken[configuration.NAMESPACE + '/user_authorization'] = {
        permissions: permissionsArr
      };
    }
    callback(null, user, context);
  });
}
```

Verify User Email with Password Reset `Not Needed`

```javascript
function verifyUserWithPasswordReset(user, context, callback) {
  const request = require("request");
  const userApiUrl = auth0.baseUrl + "/users/";

  // This rule is only for Auth0 databases
  if (context.connectionStrategy !== "auth0") {
    return callback(null, user, context);
  }

  if (user.email_verified || !user.last_password_reset) {
    return callback(null, user, context);
  }

  // Set email verified if a user has already updated his/her password
  request.patch(
    {
      url: userApiUrl + user.user_id,
      headers: {
        Authorization: "Bearer " + auth0.accessToken,
      },
      json: { email_verified: true },
      timeout: 5000,
    },
    function (err, response, body) {
      // Setting email verified isn't propagated to id_token in this
      // authentication cycle so explicitly set it to true given no errors.
      context.idToken.email_verified = !err && response.statusCode === 200;

      // Return with success at this point.
      return callback(null, user, context);
    }
  );
}
```
