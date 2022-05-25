# RFC: Simplify Domain Models

**Author:** Thomas Shallenberger

**Date:** 05/15/2022

## Summary

We need to simplify all domain models in Catalog and Sales module.

We can do this by removing Results, and reverting to normal Class Objects, with getters/setters, and raw() functions accessing the raw props.

## Design
