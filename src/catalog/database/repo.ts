// private static errorResult<T>(error: any, value: any) {
  //   const err = new Error(error?.message || error);
  //   const resultError = new ResultError(err, [], value);
  //   const result = Result.fail<T>(resultError);
  //   return result;
  // }
  // async findAll(): Promise<Product[]> {
  //   try {
  //     const result = await this.db.product
  //       .findMany({})
  //       .then((product) => {
  //         return Result.ok<DbProduct[]>(product);
  //       })
  //       .catch((err) => {
  //         this.logger.error(err);
  //         throw err;
  //       });

  //     if (result.isSuccess) {
  //       const entities = result.value();
  //       const products = entities.map((e) => Product.fromDb(e));
  //       return products;
  //     } else {
  //       throw result.error;
  //     }
  //   } catch (err: any) {
  //     this.logger.error(`${this.llog} Failed to find products.`);
  //     if (err.name == `NotFoundError`) {
  //       throw new ProductNotFoundException(``);
  //     }
  //     throw err;
  //   }
  // }
  // async existsByUuid(id: UUID): Promise<boolean> {
  //   const result = await this.db.product
  //     .findFirst({
  //       where: {
  //         uuid: id.value,
  //       },
  //       rejectOnNotFound: true,
  //     })
  //     .then((product) => {
  //       return Result.ok(product);
  //     })
  //     .catch((err) => {
  //       return DbProductsRepository.errorResult<DbProduct>(err, id);
  //     });
  //   return result.isSuccess;
  // }

  // async findByUuid(id: UUID): Promise<Product> {
  //   try {
  //     const result = await this.db.product
  //       .findFirst({
  //         where: {
  //           uuid: id.value,
  //         },
  //         rejectOnNotFound: true,
  //       })
  //       .then((product) => {
  //         return Result.ok<DbProduct>(product);
  //       })
  //       .catch((err) => {
  //         this.logger.error(err);
  //         throw err;
  //       });

  //     if (result.isSuccess) {
  //       const entity = result.value();
  //       const product = Product.fromDb(entity);
  //       return product;
  //     } else {
  //       throw result.error;
  //     }
  //   } catch (err: any) {
  //     this.logger.error(`${this.llog} Failed to find aggregate ${id.value}`);
  //     if (err.name == `NotFoundError`) {
  //       throw new ProductNotFoundException(id.value);
  //     }
  //     throw err;
  //   }
  // }
  // async findById(id: number): Promise<Product> {
  //   this.logger.debug(`${this.llog} Loading aggregate by email...`);
  //   try {
  //     const result = await this.db.product
  //       .findFirst({
  //         where: {
  //           id: id,
  //         },
  //         rejectOnNotFound: true,
  //       })
  //       .then((product) => {
  //         return product;
  //       })
  //       .catch((err) => {
  //         throw err;
  //       });

  //     const product = Product.fromDb(result);
  //     return product;
  //   } catch (err: any) {
  //     this.logger.error(`${this.llog} Failed to load aggregate ${id}`);
  //     throw err;
  //   }
  // }
  // async loadAggregate(id: UUID): Promise<Product> {
  //   this.logger.debug(`${this.llog} Loading aggregate...`);
  //   try {
  //     const result = await this.db.product
  //       .findFirst({
  //         where: {
  //           uuid: id.value,
  //         },
  //         rejectOnNotFound: true,
  //       })
  //       .then((product) => {
  //         return Result.ok<DbProduct>(product);
  //       })
  //       .catch((err) => {
  //         throw err;
  //       });

  //     if (result.isSuccess) {
  //       const entity = result.value();
  //       const product = Product.fromDb(entity);
  //       return product;
  //     }
  //   } catch (err: any) {
  //     this.logger.error(`${this.llog} Failed to load aggregate ${id.value}`);
  //     throw err;
  //   }
  // }

  // async persist(product: Product): Promise<Product> {
  //   try {
  //     const props: DbProduct = product.toDb();
  //     const uuid = props.uuid;

  //     const productTrx = this.db.product.upsert({
  //       where: { uuid: uuid },
  //       update: {
  //         ...props,
  //       },
  //       create: {
  //         ...props,
  //       },
  //     });

  //     const result = await this.db
  //       .$transaction([productTrx])
  //       .then(([product]) => {
  //         this.logger.debug(
  //           `${this.llog} Successfully persisted product ${product.id}`
  //         );
  //         return Result.ok<DbProduct>(product);
  //       })
  //       .catch((err) => {
  //         const error = new Error(err?.name ?? err?.message);
  //         this.logger.error(error.message, error.stack);
  //         throw err;
  //       });
  //     if (result.isSuccess) {
  //       const entity = result.value();
  //       const product = Product.fromDb(entity);
  //       return product;
  //     } else {
  //       this.logger.error(`${this.llog} Failed To Save Product ${uuid}`);
  //       throw result.error;
  //     }
  //   } catch (err: any) {
  //     const error = new Error(err?.name ?? err?.message);
  //     this.logger.error(error.message, error.stack);
  //     this.logger.debug(JSON.stringify(error, null, 2));
  //     throw err;
  //   }
  // }

  // async delete(id: UUID): Promise<Result<boolean>> {
  //   const result = await this.db.product
  //     .delete({
  //       where: {
  //         uuid: id.value,
  //       },
  //     })
  //     .then((product) => {
  //       return Result.ok<DbProduct>(product as DbProduct);
  //     })
  //     .catch((err) => {
  //       return Result.fail(err);
  //     });
  //   try {
  //     if (result.isSuccess) {
  //       return Result.ok();
  //     } else {
  //       return Result.fail(result.error, id.value);
  //     }
  //   } catch (err: any) {
  //     return Result.fail(err);
  //   }
  // }

  // async update() {
  //   return;
  // }