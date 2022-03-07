# RFC: Investigate MikroORM vs Prisma

**Author:** Thomas Shallenberger

**Date:** 02/17/2022

## Summary

We need to be able to simply save Aggregates to the persistence layer without worrying about implementing our own change tracking.

Prisma doesn't support change tracking or unit of work patterns like MikroORM, and it looks like MikroORM is the only one that does...TypeORM and Sequelize also don't have these features.

Pros:

- Change Tracking
- Unit of Work
- Simple "Save" implementations of Repositorys

Cons

- Potential Memory Hog?
- Will need to rework migrations
- Will need to extract Prisma?
- Json field support seems minimal
- Will need to build new schemas using MikroORM

```bash
yarn add @mikro-orm/core @mikro-orm/nestjs @mikro-orm/postgresql
./dist/app/**/entities/*.entity.ts
```

## Considerations

I will need to change the rest of the domains/contexts to use MikroORM, and change the deployment pipeline to apply migrations.

Additionally, Aggregates should be initialized with the DbEntity defined in the Schema.
