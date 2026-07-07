### Supabase CLI
Using Supabase CLI allow schema versioning.

Follow the following commands to download supabase CLI, initiate supabase folder at your project root. The last command creates an empty timestamped `.sql` file under `supabase/migrations/`. Add your finalised schema and policy into it. 

```bash
npm install supabase --save-dev      
npx supabase login                    
npx supabase init                     
npx supabase link --project-ref <your-project-ref>
npx supabase migration new create_initial_schema
```

Run the following command to migrate your schema and policy to the actual remote Postgres.
```bash
npx supabase db push
```