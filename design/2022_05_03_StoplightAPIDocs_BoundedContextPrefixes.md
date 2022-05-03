# RFC: Stoplight API Docs in CI | Bounded Context Prefixes

**Author:** Thomas Shallenberger

**Date:** 05/03/2022

## Summary

I have added Stoplight API Doc publishing to the Release pipeline.
Additionally, I have modeled API to use bounded context module names as prefixes.
And I'm renamed the Accounts module to the Auth module, as it pertains to both User and Account (Organization) authorization.

## Warning

These are breaking changes to the existing UI.
