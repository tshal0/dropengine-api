import { Migration } from '@mikro-orm/migrations';

export class Migration20220307205622 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "users" ("id" varchar(255) not null, "external_user_id" varchar(255) not null, "email" varchar(255) not null, "status" jsonb not null, "picture" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "users" add constraint "users_pkey" primary key ("id");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "users" cascade;');
  }

}
