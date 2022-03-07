import { Migration } from '@mikro-orm/migrations';

export class Migration20220218100054 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "products" ("_id" varchar(255) not null, "id" varchar(255) not null, "name" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "products" add constraint "products_pkey" primary key ("_id");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "products" cascade;');
  }

}
