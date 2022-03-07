import { Migration } from '@mikro-orm/migrations';

export class Migration20220307212335 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" drop constraint if exists "users_picture_check";');
    this.addSql('alter table "users" alter column "picture" type varchar(255) using ("picture"::varchar(255));');
    this.addSql('alter table "users" alter column "picture" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" drop constraint if exists "users_picture_check";');
    this.addSql('alter table "users" alter column "picture" type varchar(255) using ("picture"::varchar(255));');
    this.addSql('alter table "users" alter column "picture" set not null;');
  }

}
