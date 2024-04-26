# Capstone Project - Stock Portfolio App

This is a stock portfolio management application built with Vue 3. It allows users to track their stock investments, view price updates, and analyze their portfolio performance.

## Important Setup Instructions

**_1. To run App, please contact owner for API key or you can create one at [Polygon.io](https://polygon.io/)._**  
**_2. Update the `example.env` file with your API key - replace `API KEY GOES HERE WITHOUT QUOTE SYMBOLS` with your actual API key (do not use quotes)._**  
**_3. Change `example.env` file to `.env`._**  
**_4. Due to API limitations, the stock portfolio is currently limited to 5 stock holdings._**

## Project Setup

To get the project up and running on your local machine for development and testing purposes, follow these steps:

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# Runs the end-to-end tests
npm run test:e2e

```
