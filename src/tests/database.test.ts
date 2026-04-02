import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("Database migrations", () => {
  const migrationsDir = join(process.cwd(), "supabase/migrations");

  it("001_initial_schema.sql exists and contains required tables", () => {
    const sql = readFileSync(join(migrationsDir, "001_initial_schema.sql"), "utf-8");

    expect(sql).toContain("create table members");
    expect(sql).toContain("create table events");
    expect(sql).toContain("create table rsvps");
    expect(sql).toContain("create table blog_posts");
  });

  it("001_initial_schema.sql has RLS enabled on all tables", () => {
    const sql = readFileSync(join(migrationsDir, "001_initial_schema.sql"), "utf-8");

    expect(sql).toContain("alter table members enable row level security");
    expect(sql).toContain("alter table events enable row level security");
    expect(sql).toContain("alter table rsvps enable row level security");
    expect(sql).toContain("alter table blog_posts enable row level security");
  });

  it("001_initial_schema.sql has RLS policies for all tables", () => {
    const sql = readFileSync(join(migrationsDir, "001_initial_schema.sql"), "utf-8");

    expect(sql).toContain('create policy "Members are viewable');
    expect(sql).toContain('create policy "Published events are viewable');
    expect(sql).toContain('create policy "RSVPs are viewable');
    expect(sql).toContain('create policy "Published blog posts are viewable');
  });

  it("001_initial_schema.sql has auto-create member trigger", () => {
    const sql = readFileSync(join(migrationsDir, "001_initial_schema.sql"), "utf-8");

    expect(sql).toContain("create or replace function handle_new_user");
    expect(sql).toContain("on_auth_user_created");
  });

  it("001_initial_schema.sql has updated_at triggers", () => {
    const sql = readFileSync(join(migrationsDir, "001_initial_schema.sql"), "utf-8");

    expect(sql).toContain("members_updated_at");
    expect(sql).toContain("events_updated_at");
    expect(sql).toContain("blog_posts_updated_at");
  });

  it("002_storage_buckets.sql exists and creates buckets", () => {
    const sql = readFileSync(join(migrationsDir, "002_storage_buckets.sql"), "utf-8");

    expect(sql).toContain("'avatars'");
    expect(sql).toContain("'event-images'");
  });

  it("002_storage_buckets.sql has storage policies", () => {
    const sql = readFileSync(join(migrationsDir, "002_storage_buckets.sql"), "utf-8");

    expect(sql).toContain("Avatar images are publicly accessible");
    expect(sql).toContain("Event images are publicly accessible");
    expect(sql).toContain("Users can upload their own avatar");
  });
});

describe("TypeScript database types", () => {
  it("types file exists and exports Database interface", () => {
    const types = readFileSync(
      join(process.cwd(), "src/types/database.ts"),
      "utf-8",
    );

    expect(types).toContain("export interface Database");
    expect(types).toContain("members");
    expect(types).toContain("events");
    expect(types).toContain("rsvps");
    expect(types).toContain("blog_posts");
  });

  it("models file exports all required types", () => {
    const models = readFileSync(
      join(process.cwd(), "src/types/models.ts"),
      "utf-8",
    );

    expect(models).toContain("export type Event");
    expect(models).toContain("export type Member");
    expect(models).toContain("export type BlogPost");
    expect(models).toContain("export type RSVP");
    expect(models).toContain("export type EventType");
    expect(models).toContain("export type RSVPStatus");
  });
});
