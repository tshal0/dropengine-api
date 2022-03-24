import { Migration } from '@mikro-orm/migrations';

export class Migration20220324200310 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product_types" add column "image" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product_types" drop column "image";');
  }

}
