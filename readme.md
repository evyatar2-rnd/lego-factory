# Microfrontend Starter Kit

## Initial Procedures

<br/>

### Development vs Production

<ins>Production</ins>

In production, we would like to deploy the project's bundled file, means we need to serve the file `dist/index.js`, <br/>
In Terminal set on root file run:

```bash
yarn build
```

and then:<br/>

```bash
cd serve && yarn run serve
```

<ins>Development</ins>

Just run:

```bash
  yarn start-dev
```

---

<br/>

### Connect to registry

In Terminal, enter next command: <br />

```bash
curl -uYOUR_RND-HUB_MAIL:YOUR_ARTIFACTORY_GENERATED_API_KEY https://artifactory.rnd-hub.com/artifactory/api/npm/auth
```

Copy the output (starts with `_auth...`) and paste it in your home folder inside a .npmrc file: <br />
Open teminal in home folder, then enter `nano .npmrc`, paste the output, and press Ctrl+X <br />

Then:

```bash
npm config set registry https://artifactory.rnd-hub.com/artifactory/api/npm/lego-npm-virt/
```

If importing the Web Components make sure to load them in your index.js with the proper loading function,
For example: <br />
`@lego/buttons` exports the `loader` function, then only needs to execute. <br />
`@lego/sliders` is a StencilJS project, it exports a function name `defineCustomElements` which needs to be executed. <br />
`@lego/accordions` is an AtomicoJS project, it exports the Web Components classes, and 2 functions: `define` that works as `customElements.define` and `defineDependencies` which just needs to be executed.

---

## Starting a new Micro-Frontend

change name in `./package.json` and in `serve/package,json`, and make sure that the port in the scripts is not taken.
