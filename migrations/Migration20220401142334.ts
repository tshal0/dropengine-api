import { Migration } from '@mikro-orm/migrations';

export class Migration20220401142334 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "accounts" drop constraint if exists "accounts_id_check";');
    this.addSql('alter table "accounts" alter column "id" drop default;');
    this.addSql('alter table "accounts" alter column "id" type uuid using ("id"::text::uuid);');
    this.addSql('alter table "accounts" alter column "id" drop default;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "accounts" alter column "id" type text using ("id"::text);');

    this.addSql('alter table "accounts" drop constraint if exists "accounts_id_check";');
    this.addSql('alter table "accounts" alter column "id" type int using ("id"::int);');
    this.addSql('create sequence if not exists "accounts_id_seq";');
    this.addSql('select setval(\'accounts_id_seq\', (select max("id") from "accounts"));');
    this.addSql('alter table "accounts" alter column "id" set default nextval(\'accounts_id_seq\');');
  }

}
