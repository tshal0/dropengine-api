# RFC: GraphQL Investigation

**Author:** Thomas Shallenberger

**Date:** 05/25/2022

## Summary

We want to look into adding a GraphQL endpoint for querying Orders.

The reasons for investigation include

1. Original endpoint implementation was an overengineered custom query parsing mess that applies an aggregation against the endpoint on every request.
2. Queries must be able to restrict data returned based on user roles and permissions.
3. Queries must be able to perform subsequent queries for a limited single Order response from the Orders table, when they expand a row.
4. Queries must be filterable/sortable in multiple dimensions, such as between date ranges, with heavy filtering support for GTE, LTE, and IN options.

Reasons against:

1. Yet another endpoint
2. Never done GraphQL implemented in a backend (RISK)
3. Never done GraphQL in frontend (RISK)

## Design

Implementation:

1. Add packages
2. Choose schema generation (Code First vs Schema First)
3. Add module to main
4. Add GraphQL Sales Module
   1. Providers (queries, mutations, subscriptions)
   2. Resolver (use Mongo collection)
5. Mutations
   1. Should be NO mutations yet
   2. Future mutations would occur like commands.
