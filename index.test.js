const test = require('ava')
const {
  env,
  detectEnvironment,
  setDetector,
  forceEnvironment,
  default: dynamicVariables,
} = require('./index')

test('detects frontend/backend environments by default', t => {
  t.is(process.browser, undefined, 'the tests are not running in the browser')
  t.truthy(process.platform, 'the tests are running in a server/docker')

  t.is(detectEnvironment(), true, 'it is running in the backend because process.platform is set')

  process.platform = 'darwin'
  t.is(detectEnvironment(), true, 'it is running in the backend if process.platform is set')

  process.browser = true
  t.is(detectEnvironment(), false, 'it is running in the frontend if process.browser is true')

  process.browser = false
  t.is(detectEnvironment(), true, 'it is running in the frontend if process.browser is false')

  delete process.browser
  delete process.platform
  t.is(
    detectEnvironment(),
    null,
    'environment is unknown if both process.platform and process.browser are not set'
  )
})

test('detects custom environments', t => {
  setDetector(() => process.env.ENV)

  process.env.ENV = 1
  t.is(detectEnvironment(), '1', `it is running in the custom environment '${process.env.ENV}'`)
})

test('return the right variable', t => {
  let backend
  setDetector(() => backend, false)

  backend = false
  t.is(env(1, 2), 1, `fetch the primary environment`)

  backend = true
  t.is(env(1, 2), 2, `fetch the secondary environment`)

  forceEnvironment(false)
  t.is(env(1, 2), 1, `fetch the primary environment`)
})

test('caches environment and return the right variable', t => {
  let backend
  setDetector(() => backend, true)

  backend = false
  t.is(env(1, 2), 1, `fetch the primary environment`)

  backend = true
  t.is(env(1, 2), 1, `fetch the primary environment`)

  forceEnvironment(true)
  t.is(env(1, 2), 2, `fetch the secondary environment`)
})

test('execute all proxied functions', t => {
  const vars = () =>
    dynamicVariables({
      A: env(1),
      B: () => env(0, 2), // env is calculated in runtime
      C: {
        D: env(3, 0), // env is calculated in build time
        E: () => env(4),
      },
    })

  forceEnvironment(true)
  t.deepEqual(JSON.parse(JSON.stringify(vars())), {
    A: 1,
    B: 2,
    C: {
      D: 3,
      E: 4,
    },
  })

  forceEnvironment(false)
  t.deepEqual(JSON.parse(JSON.stringify(vars())), {
    A: 1,
    B: 0,
    C: {
      D: 3,
      E: 4,
    },
  })
})
