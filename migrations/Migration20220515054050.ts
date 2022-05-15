import { Migration } from '@mikro-orm/migrations';

export class Migration20220515054050 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product_variants" add column "type" varchar(255) not null default \'2DMetalArt\', add column "product_type_id" uuid not null;');
    this.addSql('alter table "product_variants" add constraint "product_variants_product_type_id_foreign" foreign key ("product_type_id") references "product_types" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product_variants" drop constraint "product_variants_product_type_id_foreign";');

    this.addSql('alter table "product_variants" drop column "type";');
    this.addSql('alter table "product_variants" drop column "product_type_id";');
  }

}
