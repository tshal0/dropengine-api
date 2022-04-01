# RFC: Accounts Module: Migrate Users to Auth0 and Integrate Tenant Accounts

**Author:** Thomas Shallenberger

**Date:** 03/30/2022

## Summary

We need to begin integration of tenants, roles, permissions into DropEngine, and transition away from local storage of user data.

We want to try to avoid storing any data in SQL that will need to be synced with Auth0.

1. Users table will be removed, Users will live in Auth0, with appropriate CRUD endpoints.
2. Tenants will be known as Accounts.
3. Accounts will have Stores, Members, Orders, Products, etc.
4. While a set of default Roles, Permissions will be stored in code, actual Roles and Permissions will live in Auth0, and managed there.
5. Roles and Permissions will live under User > AppMetadata > Accounts > CompanyCode > Roles, Permissions

## Design Decisions

1. For this bounded context I am experimenting with the use of integer primary keys over the traditional GUID (string) primary keys.
2. Additionally, Users/Members/Roles/Permissions will not reside in SQL, but in Auth0.
3. Accounts will be accessed via CompanyCodes instead of IDs:
   1. Human readable identifiers in the token and when placing orders
   2. Numeric identifiers still used for performance, company code used for loading and returning the account
