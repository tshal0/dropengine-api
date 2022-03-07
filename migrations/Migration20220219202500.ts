import { Migration } from '@mikro-orm/migrations';

export class Migration20220219202500 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product_variants" drop constraint "product_variants_pkey";');
    this.addSql('alter table "product_variants" drop column "_uuid";');
    this.addSql('alter table "product_variants" add constraint "product_variants_pkey" primary key ("uuid");');

    this.addSql('alter table "product_types" drop constraint "product_types_pkey";');
    this.addSql('alter table "product_types" drop column "_uuid";');
    this.addSql('alter table "product_types" rename column "manufacturing_details" to "production_data";');
    this.addSql('alter table "product_types" add constraint "product_types_pkey" primary key ("uuid");');

    this.addSql('alter table "products" drop constraint "products_pkey";');
    this.addSql('alter table "products" drop column "_uuid";');
    this.addSql('alter table "products" add constraint "products_pkey" primary key ("uuid");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product_variants" add column "_uuid" varchar(255) not null;');
    this.addSql('alter table "product_variants" drop constraint "product_variants_pkey";');
    this.addSql('alter table "product_variants" add constraint "product_variants_pkey" primary key ("_uuid");');

    this.addSql('alter table "product_types" add column "_uuid" varchar(255) not null;');
    this.addSql('alter table "product_types" drop constraint "product_types_pkey";');
    this.addSql('alter table "product_types" rename column "production_data" to "manufacturing_details";');
    this.addSql('alter table "product_types" add constraint "product_types_pkey" primary key ("_uuid");');

    this.addSql('alter table "products" add column "_uuid" varchar(255) not null;');
    this.addSql('alter table "products" drop constraint "products_pkey";');
    this.addSql('alter table "products" add constraint "products_pkey" primary key ("_uuid");');
  }

}
