# 🌤️ Weatherly

[Weatherly](https://weatherly-orcin.vercel.app/) is a web application that provides real-time weather conditions, forecasts, and metrics for cities around the world.

## Features

- 🌡️ Current Weather
- 📊 Weather Metrics (Humidity, Wind, Visibility, Rain)
- 📅 7-Day Forecast
- 📈 Temperature Trends
- 🗺️ Interactive City Map

## Target Platforms

- Desktop Browsers: Chrome, Firefox, Safari, Edge
- Mobile: The app displays a message on smaller screens recommending users to check via a laptop or desktop.

## 📄 [Developer Manual](#developer-manual)

---

# Developer Manual

This section is for future developers who will take over the system. You should have an understanding of JavaScript, HTML/CSS, REST APIs, and Node.js.

## Project Structure

```
├── public/
│   ├── index.html
│   ├── about.html
│   ├── search-history.html
│   ├── scripts.js
│   ├── styles.css
│   └── icons/     # Contains all the SVG assets used in this app
├── api/
│   ├── add-history.js
│   ├── get-history.js
│   └── clear-history.js
├── .env     # Not committed to Git (see .gitignore)
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Dependencies

- Node.js v19 and above
- Supabase database setup
- `.env` file with:

```
SUPABASE_URL=your_supabase_url
SUPABASE_API_KEY=your_supabase_service_role_key
```

## Installation and Setup

1. **Clone the repository:**

```
git clone https://github.com/your-username/weatherly.git
cd weatherly
```

2. **Install the dependencies:**

```
npm install
```

3. **Set up the environment:**

Create a `.env` file in the root of the app with your Supabase credentials:

```
SUPABASE_URL=your_supabase_url
SUPABASE_API_KEY=your_supabase_service_role_key
```

## Supabase Database Setup

To ensure the Weatherly app works correctly, create the following table and policies in your Supabase project.

### Table: `search-history`

| Column Name   | Type        | Default Value       | Nullable |
| ------------- | ----------- | ------------------- | -------- |
| `id`          | `uuid`      | `gen_random_uuid()` | No       |
| `city`        | `text`      | `NULL`              | No       |
| `country`     | `text`      | `NULL`              | Yes      |
| `state`       | `text`      | `NULL`              | Yes      |
| `searched_at` | `timestamp` | `now()`             | No       |

### Row Level Security (RLS) Policies

Make sure that RLS is enabled on the `search-history` table and create the following policies:

#### INSERT Policy

- **Policy Name**: Enable insert access for all users
- **Table**: search-history
- **Policy Behavior**: Permissive
- **Policy Command**: INSERT
- **Target Roles**: Defaults to all (public) roles if none selected

  ```
  create policy "Enable insert access for all users"
  on "public"."search-history"
  as PERMISSIVE
  for INSERT
  to public
  with check (
    true
  );
  ```

#### SELECT Policy

- **Policy Name**: Enable read access for all users
- **Table**: search-history
- **Policy Behavior**: Permissive
- **Policy Command**: SELECT
- **Target Roles**: Defaults to all (public) roles if none selected

  ```
  create policy "Enable read access for all users"
  on "public"."search-history"
  as PERMISSIVE
  for SELECT
  to public
  using (
    true
  );
  ```

## Running the App

- You can deploy using [Vercel](https://vercel.com), which supports the API routes in the `api/` folder by default.

- You can install the Vercel CLI and deploy using the following commands:

```
npm i -g vercel
vercel --prod
```

## API Endpoints

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| POST   | `/api/add-history`   | Adds a city to the search history. |
| GET    | `/api/get-history`   | Gets the most recent searches.     |
| DELETE | `/api/clear-history` | Clears all the search history.     |

## Known Bugs

- This app is intentionally restricted on small screens (mobile/tablet).
- There is no limit on the amount of searches, which may cause excessive requests.
- The search history is not specific to a user using the app.

## Future Development Roadmap

- Add authentication and support for storing user preferences.
- Make the UI optimized for mobile and tablet screens.
- Add more interactive and dynamic features.
- Switch to a JS framework (Vue.js or React) for better maintainability.

## About the Developer

**Oluwatobiloba Adegbaju**  
Frontend Developer & UI/UX Designer
[Portfolio](https://adeolu.netlify.app)
