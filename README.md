# Cat Finder

Cat Finder is a React + Vite app that uses [The Cat API](https://thecatapi.com/) to:

- Search cat images by breed name
- Fetch a random cat image
- Show a small spinning default cat image while loading

## Requirements

- Node.js 18+ (recommended)
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add your API key in `cat-finder/.env`:

```env
VITE_CAT_API_KEY=your_thecatapi_key_here
```

Important:
- The env file must be inside the `cat-finder` folder.
- If `npm run dev` is already running, restart it after editing `.env`.

## Run Locally

From `cat-finder/`:

```bash
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

## Usage

- Type a breed name (for example: `siamese`, `bengal`, `maine coon`) and click `Search` or press `Enter`.
- Click `Random` to get any random cat image.

## Scripts

- `npm run dev` starts development server
- `npm run build` creates production build
- `npm run preview` previews production build
- `npm run lint` runs ESLint
