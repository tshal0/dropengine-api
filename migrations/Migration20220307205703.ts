import { Migration } from '@mikro-orm/migrations';

export class Migration20220307205703 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" drop constraint if exists "users_status_check";');
    this.addSql('alter table "users" alter column "status" type varchar(255) using ("status"::varchar(255));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" drop constraint if exists "users_status_check";');
    this.addSql('alter table "users" alter column "status" type jsonb using ("status"::jsonb);');
  }

}
