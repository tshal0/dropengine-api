import { Migration } from '@mikro-orm/migrations';

export class Migration20220401222419 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "stores" ("id" uuid not null, "name" varchar(255) not null, "account_id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "stores" add constraint "stores_pkey" primary key ("id");');

    this.addSql('alter table "stores" add constraint "stores_account_id_foreign" foreign key ("account_id") references "accounts" ("id") on update cascade;');

    this.addSql('alter table "products" drop constraint if exists "products_id_check";');
    this.addSql('alter table "products" alter column "id" drop default;');
    this.addSql('alter table "products" alter column "id" type uuid using ("id"::text::uuid);');
    this.addSql('alter table "products" alter column "id" set default uuid_generate_v4();');

    this.addSql('alter table "product_variants" drop constraint if exists "product_variants_id_check";');
    this.addSql('alter table "product_variants" alter column "id" drop default;');
    this.addSql('alter table "product_variants" alter column "id" type uuid using ("id"::text::uuid);');
    this.addSql('alter table "product_variants" alter column "id" set default uuid_generate_v4();');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "stores" cascade;');

    this.addSql('alter table "product_variants" drop constraint if exists "product_variants_id_check";');
    this.addSql('alter table "product_variants" alter column "id" drop default;');
    this.addSql('alter table "product_variants" alter column "id" type uuid using ("id"::text::uuid);');
    this.addSql('alter table "product_variants" alter column "id" set default \'62b2f50d-19fd-440e-a946-0e726f4958a5\';');

    this.addSql('alter table "products" drop constraint if exists "products_id_check";');
    this.addSql('alter table "products" alter column "id" drop default;');
    this.addSql('alter table "products" alter column "id" type uuid using ("id"::text::uuid);');
    this.addSql('alter table "products" alter column "id" set default \'8c0b1bc6-aa44-4134-b078-45f636e54ed7\';');
  }

}
