import { Migration } from '@mikro-orm/migrations';

export class Migration20220515040547 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "products" rename column "custom_options" to "personalization_rules";');
    this.addSql('alter table "products" add constraint "products_sku_unique" unique ("sku");');

    this.addSql('alter table "product_variants" add constraint "product_variants_sku_unique" unique ("sku");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "products" drop constraint "products_sku_unique";');
    this.addSql('alter table "products" rename column "personalization_rules" to "custom_options";');

    this.addSql('alter table "product_variants" drop constraint "product_variants_sku_unique";');
  }

}
