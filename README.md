# readme

bootstrapped using cra [Create react app docs](./docs/cra.md)

## get started

on the root folder, run:

```sh
yarn install
```

then to start the app on port 3000 by default:

```sh
yarn start
```

## Development

it is recommended to create a `.env` file, in order to have flexibility with Create React App's  builds.
For example, disable `eslint` to get some sense of the console, until you regain control of the app.
Another example is to specify a different port than the default `3000`.

Also there is the option to use a custom `api` server, so all requests made to
`\` on the react app, automatically get forwarded to the proxy specified. More
on that on the official
[docs](https://create-react-app.dev/docs/proxying-api-requests-in-development/).

## Payment flows

- ![Vantiv](./docs/flow-vantiv.png)
- ![Tsys](./docs/flow-tsys.png)

checkout folder `./docs` for more annotations..

## Technologies

This is a react static app, that can be distributed as a bundle, normally
inside the folder `build/`.

It makes extensive use of latest react v16-17. apis, like:
  - Hooks
  - ContextApi
  - Functional Components
  - Suspense

For state management, it is using Redux, more specifically, [Redux-toolkit](https://redux-toolkit.js.org/).


The routes are defined using [react-router-dom](https://www.npmjs.com/package/react-router-dom).

For the UI and the visual identity, the library
[Ant.design](https://ant.design/components/overview/) is being used.


## Architecture

All the code lies inside the folder  `src`, which is where most of development should happen.

Inside, we find the bootstrapping `index.js`, which imports external dependencies and
bootstraps the react app with the root component, `<App/>`, defined in the file `App.js`.

This App component brings in the <Routes> component, which is where all the urls of the app are declared.

There are 2 kinds of routes in this app,
  - Public
  - Private

Which, as the name says, one doesn't require any session nor cookie setup, unlike the other.

From here on, each route defines which component it needs.

On another side, we have the `store` injected into the app, which comes from the folder `redux`.
This is what holds all the data and state that the application handles.

The folder `config` holds some constants.

The folder `hooks` brings the hooks, modules that act like 'providers' and 'services', to the otherwise
purely visual react componennts, lying inside the folder `components`.

