# RFC: User Sign Up Account Creation Redesign

**Author:** Thomas Shallenberger

**Date:** 01/24/2022

## Summary

With the refactor and removal of the NextJS frontend, we're revamping the backend implementation of user sign up to allow us the freedom to implement a custom Sign Up page, and also integrate Auth0 post sign-up, so that we're not allowing Auth0 to generate our primary UserIDs.

## Design

Goals:

1. Add endpoint for User SignUp that does not require a primary user ID set.
2. Add Auth0 API Client that allows us to create Users in Auth0 once they have been saved internally.

User SignUp Flow:

1. User navigates to landing page
2. User clicks SignUp
3. User is taken to custom SignUp page
4. User enters details:
   1. FirstName
   2. LastName
   3. UserName
   4. Email
   5. Merchant/Manufacturer/3PS service account?
   6. Whether they intend on connecting a Shopify Account?
5. User clicks Sign Up
   1. Data is saved to database, User is created
   2. Payload is crafted and sent to Auth0 Management (or public) API, creating user
   3. Users Auth0 data is saved (metadata?)
6. User is redirected to Home Page (or Dashboard?) (different from Landing Page)
7. User presented with option to go to their Profile to upload a profile picture?
