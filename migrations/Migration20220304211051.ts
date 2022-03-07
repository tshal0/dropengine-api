import { Migration } from '@mikro-orm/migrations';

export class Migration20220304211051 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product_types" drop column "id";');

    this.addSql('alter table "products" drop column "id";');
    this.addSql('alter table "products" rename column "product_type_id" to "product_type_uuid";');
    this.addSql('alter table "products" add constraint "products_product_type_uuid_foreign" foreign key ("product_type_uuid") references "product_types" ("uuid") on update cascade;');

    this.addSql('alter table "product_variants" drop column "id";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "products" drop constraint "products_product_type_uuid_foreign";');

    this.addSql('alter table "product_types" add column "id" serial primary key;');

    this.addSql('alter table "products" add column "id" serial primary key;');
    this.addSql('alter table "products" rename column "product_type_uuid" to "product_type_id";');

    this.addSql('alter table "product_variants" add column "id" serial primary key;');
  }

}
