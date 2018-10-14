# Sonos Web

A progressive web app for the Sonos Music API.

## Setup

1. Register an account with [Sonos Developers](https://developer.sonos.com) and create an app
2. Register an account with [Pusher](https://pusher.com/) and create an app
3. Copy the .env file over from `.env.example`

For web hooks to work, you'll need to setup a publically accessible URL. This is kind of a pain, but you can achieve this by installing [ngrok](https://ngrok.com/). Then configure the related webhook URLs (event callback for Sonos, presence webhook for Pusher).

Then take a deap breath... Now run the app:

```javascript
yarn start:dev
```

## Working your way around the app

This app uses yarn workspaces to stay organized. Logistical pieces are split into seperate packages:

- config: Per-environment configuration. The values in these environments are informed by `.env`
- networking: Commonly referenced XHR and WebSockets configuration
- sonos-client: The actual app, powered by [Sapper/Svelte](https://sapper.svelte.technology)
- sonos-server: Backend data processing handled by [Apollo](apollographql.com) using GraphQL
- sonos-events: Webhook callbacks and subscriptions to send data to clients as player information changes
- sonos-oauth: The oauth2 strategy for acquiring a Sonos auth token from a user

---

![Screenshot](./docs/screenshot.png)
