import { Migration } from '@mikro-orm/migrations';

export class Migration20220220045042 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "products" add column "product_type_id" varchar(255) not null, add column "image" varchar(255) not null, add column "variants" jsonb not null;');
    this.addSql('alter table "products" drop constraint if exists "products_tags_check";');
    this.addSql('alter table "products" alter column "tags" type jsonb using ("tags"::jsonb);');
    this.addSql('alter table "products" alter column "tags" set not null;');
    this.addSql('alter table "products" drop constraint if exists "products_categories_check";');
    this.addSql('alter table "products" alter column "categories" type jsonb using ("categories"::jsonb);');
    this.addSql('alter table "products" alter column "categories" set not null;');
    this.addSql('alter table "products" drop constraint if exists "products_custom_options_check";');
    this.addSql('alter table "products" alter column "custom_options" type jsonb using ("custom_options"::jsonb);');
    this.addSql('alter table "products" alter column "custom_options" set not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "products" drop constraint if exists "products_tags_check";');
    this.addSql('alter table "products" alter column "tags" type jsonb using ("tags"::jsonb);');
    this.addSql('alter table "products" alter column "tags" drop not null;');
    this.addSql('alter table "products" drop constraint if exists "products_categories_check";');
    this.addSql('alter table "products" alter column "categories" type jsonb using ("categories"::jsonb);');
    this.addSql('alter table "products" alter column "categories" drop not null;');
    this.addSql('alter table "products" drop constraint if exists "products_custom_options_check";');
    this.addSql('alter table "products" alter column "custom_options" type jsonb using ("custom_options"::jsonb);');
    this.addSql('alter table "products" alter column "custom_options" drop not null;');
    this.addSql('alter table "products" drop column "product_type_id";');
    this.addSql('alter table "products" drop column "image";');
    this.addSql('alter table "products" drop column "variants";');
  }

}
