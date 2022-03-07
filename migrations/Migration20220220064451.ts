import { Migration } from '@mikro-orm/migrations';

export class Migration20220220064451 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "products" drop column "variants";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "products" add column "variants" jsonb not null;');
  }

}
