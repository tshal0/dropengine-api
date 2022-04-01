import { Migration } from "@mikro-orm/migrations";

export class Migration20220401203422 extends Migration {
  async up(): Promise<void> {
    this.addSql('create extension "uuid-ossp";');
    this.addSql(
      'alter table "products" drop constraint "products_product_type_uuid_foreign";'
    );

    this.addSql(
      'alter table "product_variants" drop constraint "product_variants_product_uuid_foreign";'
    );

    this.addSql(
      'alter table "product_types" add column "id" uuid not null default uuid_generate_v4();'
    );
    this.addSql(
      'alter table "product_types" drop constraint "product_types_pkey";'
    );
    this.addSql('alter table "product_types" drop column "uuid";');
    this.addSql(
      'alter table "product_types" add constraint "product_types_pkey" primary key ("id");'
    );

    this.addSql(
      'alter table "products" add column "id" uuid not null default \'8c0b1bc6-aa44-4134-b078-45f636e54ed7\', add column "product_type_id" uuid not null;'
    );
    this.addSql('alter table "products" drop constraint "products_pkey";');
    this.addSql(
      'alter table "products" add constraint "products_product_type_id_foreign" foreign key ("product_type_id") references "product_types" ("id") on update cascade;'
    );
    this.addSql('alter table "products" drop column "uuid";');
    this.addSql('alter table "products" drop column "product_type_uuid";');
    this.addSql(
      'alter table "products" add constraint "products_pkey" primary key ("id");'
    );

    this.addSql(
      'alter table "product_variants" add column "id" uuid not null default \'62b2f50d-19fd-440e-a946-0e726f4958a5\', add column "product_id" uuid not null;'
    );
    this.addSql(
      'alter table "product_variants" drop constraint "product_variants_pkey";'
    );
    this.addSql(
      'alter table "product_variants" add constraint "product_variants_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;'
    );
    this.addSql('alter table "product_variants" drop column "uuid";');
    this.addSql('alter table "product_variants" drop column "product_uuid";');
    this.addSql(
      'alter table "product_variants" add constraint "product_variants_pkey" primary key ("id");'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product_variants" drop constraint "product_variants_product_id_foreign";'
    );

    this.addSql(
      'alter table "products" drop constraint "products_product_type_id_foreign";'
    );

    this.addSql(
      'alter table "product_types" add column "uuid" varchar not null default null;'
    );
    this.addSql(
      'alter table "product_types" drop constraint "product_types_pkey";'
    );
    this.addSql('alter table "product_types" drop column "id";');
    this.addSql(
      'alter table "product_types" add constraint "product_types_pkey" primary key ("uuid");'
    );

    this.addSql(
      'alter table "product_variants" add column "uuid" varchar not null default null, add column "product_uuid" varchar not null default null;'
    );
    this.addSql(
      'alter table "product_variants" drop constraint "product_variants_pkey";'
    );
    this.addSql(
      'alter table "product_variants" add constraint "product_variants_product_uuid_foreign" foreign key ("product_uuid") references "products" ("uuid") on update cascade on delete no action;'
    );
    this.addSql('alter table "product_variants" drop column "id";');
    this.addSql('alter table "product_variants" drop column "product_id";');
    this.addSql(
      'alter table "product_variants" add constraint "product_variants_pkey" primary key ("uuid");'
    );

    this.addSql(
      'alter table "products" add column "uuid" varchar not null default null, add column "product_type_uuid" varchar not null default null;'
    );
    this.addSql('alter table "products" drop constraint "products_pkey";');
    this.addSql(
      'alter table "products" add constraint "products_product_type_uuid_foreign" foreign key ("product_type_uuid") references "product_types" ("uuid") on update cascade on delete no action;'
    );
    this.addSql('alter table "products" drop column "id";');
    this.addSql('alter table "products" drop column "product_type_id";');
    this.addSql(
      'alter table "products" add constraint "products_pkey" primary key ("uuid");'
    );
  }
}
