# BlogSphere Backend (My Blog API)

This is the REST API I built for my own blog platform using Node.js, Express, and PostgreSQL. It includes core features like JWT-based auth, category/tag management, comments, reactions, bookmarks, notifications, and file uploads.

### What It Includes
- Create, list, update, delete blog posts
- Comments, reactions (like/dislike etc.), and bookmarks
- Category and tag management
- JWT-based user sign up/sign in
- Password reset flow
- Image/file uploads (static serving at `/uploads`)

### Requirements
- Node.js 18+
- PostgreSQL 14+ (I run it locally)
- npm

### Setup
```bash
npm install
```

### Environment Variables (.env)
The server uses `dotenv`. At minimum, I define the following:
```env
PORT=3000
JWT_SECRET=put-a-long-and-strong-secret-here
# You can also set PostgreSQL here if you prefer; there are defaults in db.js
# PGUSER=firat
# PGHOST=localhost
# PGDATABASE=blogdb
# PGPASSWORD=
# PGPORT=5432
```

Note: Right now, PostgreSQL connection defaults are set for my local environment in `db.js`. You can update `db.js` for your machine or extend it to read all connection details from environment variables.

### Database
I create the database first, then load the schema:
```bash
# create database
psql -U postgres -c "CREATE DATABASE blogdb;"

# base schema
psql -U postgres -d blogdb -f database_schema.sql

# run migration files as needed, in order
# examples:
# psql -U postgres -d blogdb -f migrate_add_view_count.sql
# psql -U postgres -d blogdb -f migrate_add_blog_views_table.sql
# psql -U postgres -d blogdb -f migrate_add_missing_features_fixed.sql
# psql -U postgres -d blogdb -f migrate_add_category_icons.sql
# psql -U postgres -d blogdb -f migrate_add_password_reset_tables_fixed.sql
```

### Run
For development:
```bash
npm run dev
```
Production-like start:
```bash
npm start
```
After starting, health check:
```text
GET http://localhost:3000/api/health
```

### API Roots
Once the server is up, main endpoints are:
- `/api/blogs`
- `/api/users` (also aliased as `/api/auth`)
- `/api/categories`
- `/api/comments`
- `/api/reactions`
- `/api/bookmarks`
- `/api/tags`
- `/api/notifications`
- `/api/uploads` (upload operations) and `GET /uploads/...` (static serving)

For detailed routes/params, I look into the `routes/` and `controllers/` folders.

### Test/Sample Scripts
I added small scripts for local testing:
```bash
node test_view_count.js
node test_bookmark.js
node test_profile.js
```

### Notes
- Uploaded files go under the `uploads/` directory. In production, I recommend using persistent storage for this folder.
- The password reset flow needs an email service; I tested with my SMTP settings. In your environment, you may need to provide SMTP configuration according to how it's used under `services/`.

### License
ISC
