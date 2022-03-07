import { Migration } from '@mikro-orm/migrations';

export class Migration20220303184748 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "products" add column "type" varchar(255) not null, add column "pricing_tier" varchar(255) not null;');
    this.addSql('alter table "products" drop column "categories";');

    this.addSql('alter table "product_variants" add column "height" jsonb not null, add column "width" jsonb not null, add column "weight" jsonb not null, add column "manufacturing_cost" jsonb not null, add column "shipping_cost" jsonb not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "products" add column "categories" jsonb not null;');
    this.addSql('alter table "products" drop column "type";');
    this.addSql('alter table "products" drop column "pricing_tier";');

    this.addSql('alter table "product_variants" drop column "height";');
    this.addSql('alter table "product_variants" drop column "width";');
    this.addSql('alter table "product_variants" drop column "weight";');
    this.addSql('alter table "product_variants" drop column "manufacturing_cost";');
    this.addSql('alter table "product_variants" drop column "shipping_cost";');
  }

}
