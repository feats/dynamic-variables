let cacheEnvironment = true
let storedEnvironment = null

let detector = () => {
  // detects if app is running in SSR or not (process.browser is used by webpack, browserify, next.js, ...)
  if ('browser' in process) {
    return !process.browser
  }

  // detects if it's being executed in docker
  if ('platform' in process) {
    return true
  }

  return null
}

const setDetector = (fn, cacheResult = true) => {
  detector = fn
  cacheEnvironment = cacheResult
  storedEnvironment = null
}

const forceEnvironment = value => {
  cacheEnvironment = true
  storedEnvironment = value
}

const detectEnvironment = () => (storedEnvironment = detector())

const env = (primary, secondary) => {
  const environment =
    cacheEnvironment && storedEnvironment !== null ? storedEnvironment : detectEnvironment()

  if (environment === null) {
    throw new Error('impossible to detect environment')
  }

  let value
  if (primary === Object(primary)) {
    value = primary[environment]
  } else {
    value = environment && secondary ? secondary : primary
  }

  if (value === undefined) {
    throw new Error(`required variable could not be found`)
  }

  return value
}

const wrapper = obj => {
  try {
    return new Proxy(obj, {
      get: (target, name) =>
        typeof target[name] === 'function' ? target[name]() : target[name] && wrapper(target[name]),
    })
  } catch (e) {
    return obj
  }
}

module.exports = {
  __esModule: true,
  default: wrapper,
  env,
  setDetector,
  forceEnvironment,
  detectEnvironment,
}
