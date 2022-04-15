# RFC: Domain Events Integration

**Author:** Thomas Shallenberger

**Date:** 04/15/2022

## Summary

I want to begin adding Domain Events to all Aggregates
These events will also be broadcast internally using an event emitter.

## Model

1. Events
   1. userId (null)
      1. Dispatching user
   2. eventId
      1. UUID
   3. eventType
      1. String denoting event type (SalesOrder.Placed)
   4. aggregateId
      1. UUID
   5. aggregateType
      1. String denoting aggregate type (SalesOrder, Account, User)
   6. timestamp
      1. DateTime
   7. details
      1. schema (v1, v2)
      2. other
2. UserEvents
   1. userId
   2. accountId
   3. eventId
   4. eventType
   5. timestamp
   6. details
