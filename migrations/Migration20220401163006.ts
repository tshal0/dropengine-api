import { Migration } from '@mikro-orm/migrations';

export class Migration20220401163006 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "accounts" add column "owner_id" varchar(255) not null;');
    this.addSql('alter table "accounts" drop column "owner";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "accounts" add column "owner" jsonb not null;');
    this.addSql('alter table "accounts" drop column "owner_id";');
  }

}
