# RFC: Add Value Objects to Domain Model

**Author:** Thomas Shallenberger

**Date:** 02/16/2022

## Summary

Previously, we haven't used value objects in Domain models for simplicity and speed.

Additionally, we've traditionally embedded toDb and fromDb mapper methods into Domain models, for speed.

We are now going to move to using Value Objects more in the models, and moving toDb and fromDb methods into the persistence layer where they belong.
