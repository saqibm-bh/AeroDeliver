# Database Migrations for AeroDeliver

This directory contains SQL migration files that should be executed against your Supabase database to set up the schema for the AeroDeliver application.

## Migration Files

- `001_create_stores_table.sql`: Creates the stores table and migrates data from the restaurants table.

## Running Migrations

These migrations can be run using the Supabase CLI or directly in the SQL editor of your Supabase dashboard.

### Using Supabase CLI

1. Install the Supabase CLI if you haven't already:
   ```
   npm install -g supabase
   ```

2. Log in to your Supabase account:
   ```
   supabase login
   ```

3. Link your project:
   ```
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. Run the migrations:
   ```
   supabase db push
   ```

### Using Supabase Dashboard

1. Navigate to your Supabase project dashboard
2. Go to the SQL Editor
3. Open the migration file (e.g., `001_create_stores_table.sql`)
4. Execute the SQL statements

## Migration Order

Ensure you run the migrations in the correct numerical order to maintain proper database schema dependencies.

## Backup

Always backup your database before running migrations in a production environment.

```
supabase db dump -f backup.sql
```
