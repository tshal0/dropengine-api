import { Migration } from '@mikro-orm/migrations';

export class Migration20220606204830 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "product_types" ("id" serial primary key, "name" varchar(255) not null, "slug" varchar(255) not null, "image" varchar(255) null, "production_data" jsonb not null, "option1" jsonb null, "option2" jsonb null, "option3" jsonb null, "live_preview" jsonb not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "products" ("id" serial primary key, "type" varchar(255) not null, "sku" varchar(255) not null default \'\', "pricing_tier" varchar(255) not null default \'1\', "tags" jsonb not null, "image" varchar(255) not null default \'\', "svg" varchar(255) not null default \'\', "personalization_rules" jsonb not null, "product_type_id" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "products" add constraint "products_sku_unique" unique ("sku");');

    this.addSql('create table "product_variants" ("id" serial primary key, "sku" varchar(255) not null, "image" varchar(255) not null, "type" varchar(255) not null default \'2DMetalArt\', "height" jsonb not null, "width" jsonb not null, "weight" jsonb not null, "option1" jsonb not null, "option2" jsonb not null, "option3" jsonb not null, "manufacturing_cost" jsonb not null, "shipping_cost" jsonb not null, "product_id" int not null, "product_type_id" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "product_variants" add constraint "product_variants_sku_unique" unique ("sku");');

    this.addSql('alter table "products" add constraint "products_product_type_id_foreign" foreign key ("product_type_id") references "product_types" ("id") on update cascade;');

    this.addSql('alter table "product_variants" add constraint "product_variants_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;');
    this.addSql('alter table "product_variants" add constraint "product_variants_product_type_id_foreign" foreign key ("product_type_id") references "product_types" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "products" drop constraint "products_product_type_id_foreign";');

    this.addSql('alter table "product_variants" drop constraint "product_variants_product_type_id_foreign";');

    this.addSql('alter table "product_variants" drop constraint "product_variants_product_id_foreign";');

    this.addSql('drop table if exists "product_types" cascade;');

    this.addSql('drop table if exists "products" cascade;');

    this.addSql('drop table if exists "product_variants" cascade;');
  }

}
