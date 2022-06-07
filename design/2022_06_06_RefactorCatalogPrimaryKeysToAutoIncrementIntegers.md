# RFC: GraphQL Investigation

**Author:** Thomas Shallenberger

**Date:** 05/25/2022

## Summary

Before we move into Manufacturing, I'd like to refactor back to integer primary keys, rebuilding the Catalog module into something more resilient and performant.

Currently, UUIDs are not as flexible or performant as we need them to be.
