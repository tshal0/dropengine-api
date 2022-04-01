import { Migration } from '@mikro-orm/migrations';

export class Migration20220331221013 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "accounts" ("id" serial primary key, "name" varchar(255) not null, "owner" jsonb not null, "company_code" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('drop table if exists "users" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "users" ("id" varchar not null default null, "external_user_id" varchar not null default null, "email" varchar not null default null, "status" varchar not null default null, "picture" varchar null default null, "first_name" varchar not null default null, "last_name" varchar not null default null, "created_at" timestamptz not null default null, "updated_at" timestamptz not null default null);');
    this.addSql('alter table "users" add constraint "users_pkey" primary key ("id");');

    this.addSql('drop table if exists "accounts" cascade;');
  }

}
