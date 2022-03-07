import { Migration } from '@mikro-orm/migrations';

export class Migration20220219195613 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "product_variants" ("_uuid" varchar(255) not null, "uuid" varchar(255) not null, "id" serial primary key, "sku" varchar(255) not null, "image" varchar(255) not null, "height" jsonb not null, "width" jsonb not null, "weight" jsonb not null, "option1" jsonb not null, "option2" jsonb not null, "option3" jsonb not null, "base_cost" jsonb not null, "color_cost" jsonb not null, "manufacturing_cost" jsonb not null, "shipping_cost" jsonb not null, "base_price" jsonb not null, "compare_at_price" jsonb not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "product_types" ("_uuid" varchar(255) not null, "uuid" varchar(255) not null, "id" serial primary key, "name" varchar(255) not null, "manufacturing_details" jsonb not null, "option1" jsonb null, "option2" jsonb null, "option3" jsonb null, "live_preview" jsonb not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('alter table "products" add column "_uuid" varchar(255) not null, add column "uuid" varchar(255) not null, add column "sku" varchar(255) not null, add column "svg" varchar(255) not null, add column "tags" jsonb null, add column "categories" jsonb null, add column "custom_options" jsonb null;');
    this.addSql('alter table "products" drop constraint if exists "products_id_check";');
    this.addSql('alter table "products" alter column "id" type int using ("id"::int);');
    this.addSql('alter table "products" drop constraint "products_pkey";');
    this.addSql('alter table "products" drop column "_id";');
    this.addSql('alter table "products" drop column "name";');
    this.addSql('create sequence if not exists "products_id_seq";');
    this.addSql('select setval(\'products_id_seq\', (select max("id") from "products"));');
    this.addSql('alter table "products" alter column "id" set default nextval(\'products_id_seq\');');
    this.addSql('alter table "products" add constraint "products_pkey" primary key ("_uuid");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "product_variants" cascade;');

    this.addSql('drop table if exists "product_types" cascade;');

    this.addSql('alter table "products" add column "_id" varchar(255) not null, add column "name" varchar(255) not null;');
    this.addSql('alter table "products" drop constraint if exists "products_id_check";');
    this.addSql('alter table "products" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql('alter table "products" drop constraint "products_pkey";');
    this.addSql('alter table "products" drop column "_uuid";');
    this.addSql('alter table "products" drop column "uuid";');
    this.addSql('alter table "products" drop column "sku";');
    this.addSql('alter table "products" drop column "svg";');
    this.addSql('alter table "products" drop column "tags";');
    this.addSql('alter table "products" drop column "categories";');
    this.addSql('alter table "products" drop column "custom_options";');
    this.addSql('alter table "products" alter column "id" drop default;');
    this.addSql('alter table "products" add constraint "products_pkey" primary key ("_id");');
  }

}
