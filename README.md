# Allergy Tracker
A New Zealand focused Hay Fever Tracking App that lets you log daily hay fever symptoms in a few taps. 

🔗 **[Live Demo](https://allergy-tracker-q0vb.onrender.com)**

### Features
1. Daily Check-in with optional symptom tags
2. Pollen Forecast pulled from MetService
3. 7-day Trend Chart - work in progress
4. Daily reminder - work in progress
5. Installable PWA - works offline, and all data stays on your device until you're ready to sync

<table>
  <tr>
    <td align="center">
      <img src="./assets/screenshot_homepage_check_in.png" width="250"><br/>
      <em>Daily check-in screen</em>
    </td>
    <td align="center">
      <img src="./assets/screenshot_log_form.png" width="250"><br/>
      <em>Log Form screen</em>
    </td>
    <td align="center">
      <img src="./assets/screenshot_record.png" width="250"><br/>
      <em>Daily Record screen</em>
    </td>
    <td align="center">
      <img src="./assets/screenshot_trend.png" width="250"><br/>
      <em>7-day Trend screen</em>
    </td>
  </tr>
</table>

### Potential Further Development
The log data collected could be used to study the personalised pollen-symptom pattern, as well as effectiveness of potential treatments.

### Potential Treatments to Help Relieve Hay Fever Symptoms
1. Local honey
2. Acupuncture

### Environmental Factors That Could Affect Hay Fever
- Pollen type
- Weather: Humidity, Rain, Wind, Temperature

## Tech Stack
- Backend: FastAPI
- Frontend: React + MUI + Tailwind CSS
- Database & Auth: Supabase

## ERD
```mermaid
erDiagram
    AUTH_USERS {
        uuid id PK "Supabase auth.users table (external)"
    }

    DAILY_POLLEN_FORECASTS {
        uuid id PK "DEFAULT gen_random_uuid()"
        date date "NOT NULL; UK_date_location [1/2]"
        text location "NOT NULL; UK_date_location [2/2]"
        jsonb imminent "NOT NULL DEFAULT []"
        jsonb low "NOT NULL DEFAULT []"
        jsonb moderate "NOT NULL DEFAULT []"
        jsonb high "NOT NULL DEFAULT []"
        timestamptz checked_at "DEFAULT now()"
    }

    ENTRIES {
        uuid id PK "DEFAULT gen_random_uuid()"
        date date "NOT NULL; UK_date_user_id [1/2]" 
        int severity "CHECK severity BETWEEN 0 AND 3"
        jsonb symptoms "NULL"
        text notes "NULL"
        timestamptz created_at "DEFAULT now()"
        timestamptz updated_at "DEFAULT now()"
        uuid user_id FK "NOT NULL REFERENCES auth.users(id); UK_date_user_id [2/2]"
        text location "NOT NULL"
        boolean honey "DEFAULT false"
    }

    AUTH_USERS ||--o{ ENTRIES : creates
```

### Constraint summary

`daily_pollen_forecasts`
- `id` is the primary key.
- `date` is required.
- `location` is required.
- `imminent`, `low`, `moderate`, and `high` are required JSONB fields with default `'[]'::jsonb`.
- `checked_at` defaults to the current timestamp.
- Unique constraint: `(date, location)`.

`entries`
- `id` is the primary key.
- `date` is required.
- `severity` must satisfy `0 <= severity <= 3`.
- `symptoms` and `notes` are optional.
- `created_at` and `updated_at` default to `now()`.
- `user_id` is required and references `auth.users(id)`.
- `location` is required.
- Unique constraint: `(date, user_id)`.

Relationship notes
- Each `entries` row belongs to one `auth.users` record.
- `daily_pollen_forecasts` is a separate read-only public dataset for pollutant forecast data by date and location.