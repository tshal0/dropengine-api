import { Migration } from '@mikro-orm/migrations';

export class Migration20220221190208 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product_variants" add column "product_uuid" varchar(255) not null;');
    this.addSql('alter table "product_variants" add constraint "product_variants_product_uuid_foreign" foreign key ("product_uuid") references "products" ("uuid") on update cascade;');
    this.addSql('alter table "product_variants" drop column "height";');
    this.addSql('alter table "product_variants" drop column "width";');
    this.addSql('alter table "product_variants" drop column "weight";');
    this.addSql('alter table "product_variants" drop column "base_cost";');
    this.addSql('alter table "product_variants" drop column "color_cost";');
    this.addSql('alter table "product_variants" drop column "manufacturing_cost";');
    this.addSql('alter table "product_variants" drop column "shipping_cost";');
    this.addSql('alter table "product_variants" drop column "base_price";');
    this.addSql('alter table "product_variants" drop column "compare_at_price";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product_variants" drop constraint "product_variants_product_uuid_foreign";');

    this.addSql('alter table "product_variants" add column "height" jsonb not null, add column "width" jsonb not null, add column "weight" jsonb not null, add column "base_cost" jsonb not null, add column "color_cost" jsonb not null, add column "manufacturing_cost" jsonb not null, add column "shipping_cost" jsonb not null, add column "base_price" jsonb not null, add column "compare_at_price" jsonb not null;');
    this.addSql('alter table "product_variants" drop column "product_uuid";');
  }

}
