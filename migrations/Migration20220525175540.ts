import { Migration } from '@mikro-orm/migrations';

export class Migration20220525175540 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "products" alter column "sku" type varchar(255) using ("sku"::varchar(255));');
    this.addSql('alter table "products" alter column "sku" set default \'\';');
    this.addSql('alter table "products" alter column "svg" type varchar(255) using ("svg"::varchar(255));');
    this.addSql('alter table "products" alter column "svg" set default \'\';');
    this.addSql('alter table "products" alter column "image" type varchar(255) using ("image"::varchar(255));');
    this.addSql('alter table "products" alter column "image" set default \'\';');
    this.addSql('alter table "products" alter column "pricing_tier" type varchar(255) using ("pricing_tier"::varchar(255));');
    this.addSql('alter table "products" alter column "pricing_tier" set default \'1\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "products" alter column "sku" drop default;');
    this.addSql('alter table "products" alter column "sku" type varchar using ("sku"::varchar);');
    this.addSql('alter table "products" alter column "pricing_tier" drop default;');
    this.addSql('alter table "products" alter column "pricing_tier" type varchar using ("pricing_tier"::varchar);');
    this.addSql('alter table "products" alter column "image" drop default;');
    this.addSql('alter table "products" alter column "image" type varchar using ("image"::varchar);');
    this.addSql('alter table "products" alter column "svg" drop default;');
    this.addSql('alter table "products" alter column "svg" type varchar using ("svg"::varchar);');
  }

}
