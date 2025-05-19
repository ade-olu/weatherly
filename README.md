# 🌤️ Weatherly

Weatherly is a responsive web application that provides real-time weather conditions, forecasts, and metrics for cities around the world.

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

This section is for future developers who will take over the system. It assumes you understand JavaScript, HTML/CSS, REST APIs, and Node.js.

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
SUPABASE_API_KEY=your_supabase_anon_key
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

Create a `.env` file in the root of the app with your Supabase credentials.

## Running the App

- You can deploy using [Vercel](https://vercel.com), which supports the API routes in the `api/` folder by default.

- Using Vercel CLI: Install the CLI and deploy using the following commands:

```
npm i -g vercel
```

```
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

## Future Development Roadmap

- Add authentication and support for storing user preferences.
- Make the UI optimized for mobile and tablet screens.
- Add more interactive and dynamic features.
- Switch to a JS framework (Vue.js or React) for better maintainability.

## About the Developer

**Oluwatobiloba Adegbaju**  
Frontend Developer & UI/UX Designer
