<p align="center">
<strong>Dynamic variables based on environment (or anything else!)</strong><br />
<sub>feats' dynamic-variables is a minimalist choice for switching environmental variables in your app.</sub>
</p>

<p align="center">
  [ <a href="#getting-started">Getting started 🤓</a> | <a href="https://www.npmjs.com/package/jako">Check it on NPM 👌</a> ]
</p>


![divider](.github/divider.png)

## Setting up

### Installing it

You can install it from one of these 3 options:

#### with NPM

```bash
  $ npm install @feats/dynamic-variables
```

#### with Yarn

```bash
  $ yarn add @feats/dynamic-variables
```

#### manually
you may also install it as a development dependency in a package.json file:

```json
  // package.json
  "dependencies": {
    "@feats/dynamic-variables": "latest"
  }
```

Then install it with either `npm install` or `yarn install`

![divider](.github/divider.png)

## Getting started

### Basic usage

```js
import { env } from '@feats/dynamic-variables'

const backendEndpoint = env(process.env.API_SERVER_PUBLIC, process.env.API_SERVER_CONTAINER)

// backendEndpoint will be assigned 'API_SERVER_PUBLIC` in the browser
//  ... and 'API_SERVER_CONTAINER' in the server
```


### Advanced usage

#### Multiple named environments + Custom environment detector

```js
import { env, setDetector } from '@feats/dynamic-variables'

setDetector(() => process.browser ? 'BROWSER' : 'SSR')

const backendEndpoint = env({BROWSER: process.env.API_SERVER_PUBLIC, SSR: process.env.API_SERVER_CONTAINER})

// backendEndpoint will be assigned 'API_SERVER_PUBLIC` in the browser
//  ... and 'API_SERVER_CONTAINER' in the server
```

#### Multiple services endpoints

```js
import environment, { env } from '@feats/dynamic-variables'

module.exports = environment({
  redis: env(process.env.REDIS_CONTAINER),
  backend: {
    graphq: env(process.env.GRAPHQL_SERVER_PUBLIC, process.env.GRAPHQL_SERVER_CONTAINER),
    // 🌈 Note that backend.rest below is a function! ☄️
    // As such, it can avoid ReferenceErrors in case the variables in it were not defined
    rest: () => env(process.env.REST_SERVER_PUBLIC, process.env.REST_SERVER_CONTAINER),
  }
})
```

For more examples, please check the [tests file](./index.test.js).

I hope you enjoy using this tiny lib! 🎉

![divider](.github/divider.png)
