# Auth0

Rules:

```javascript
function addEmailToAccessToken(user, context, callback) {
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
function (user, context, callback) {
  var namespace = configuration.NAMESPACE;
  const assignedRoles = (context.authorization || {}).roles;
  context.accessToken[namespace + '/roles'] = assignedRoles;
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

Verify User Email with Password Reset

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

```javascript

```

```javascript

```
