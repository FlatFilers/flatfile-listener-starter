import rc from 'rc'
import dotenv from 'dotenv'
import { z } from 'zod'

const interpolation = require('interpolate-json').interpolation

/**
 * Get the configuration for this Flatfile deployment.
 *
 * Uses the common `rc` package to load and merge configuration from the following places in order:
 *
 * - command line arguments, parsed by minimist (e.g. --foo baz, also nested: --foo.bar=baz)
 * - environment variables prefixed with FLATFILE_
 * - any environment variables provided in .env files
 * - if you passed an option --config file then from that file
 * - a local .flatfilerc or the first found traversing the directory path
 * - $HOME/.flatfilerc
 * - $HOME/.flatfile/config
 * - $HOME/.config/flatfile
 * - $HOME/.config/flatfile/config
 * - /etc/flatfilerc
 * - /etc/flatfile/config
 * - default values
 *
 * @param overrides
 */
export function config(
  overrides?: Partial<{
    env?: string
    version?: string | number
    region?: string
    endpoint?: string
    account?: string
    clientId?: string
    secret?: string
    auth?: string
    team?: number
    internal?: object
  }>
): Config {
  const fullConfig = {
    ...rawConfig,
    ...removeEmpty(overrides),
  }

  const config = interpolation.expand(fullConfig)

  const x = config.version >= 10
  const auth = config.auth === 'false' ? false : true
  return x
    ? ConfigValidation.parse(castNumbers({ ...config, x, auth }))
    : { ...config, x }
}

/**
 * Basic utility function for removing empty values from an object
 *
 * @example { foo: null, bar: '', baz: 'hello' } => { baz: 'hello' }
 * @param obj any object
 */
function removeEmpty(obj?: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj || {}).filter(([_, v]) => v != null)
  )
}

/**
 * Basic utility function to cast the numeric values of an object to a number
 *
 * @example { foo: '11', baz: 'hello' } => { foo: 11, baz: 'hello' }
 * @param obj any object
 */
function castNumbers(obj?: Record<string, string | number>) {
  return Object.fromEntries(
    Object.entries(obj || {}).map(([k, v]) => [
      k,
      typeof v === 'string' && /^[0-9]+$/.test(v) ? parseInt(v, 10) : v,
    ])
  )
}

// --- the following runs globally on import as part of setup

dotenv.config()

// import .env values into rc as defaults that can be overwritten
const rawConfig = rc('flatfile', {
  env: 'test',
  version: 3,
  account: null,
  region: 'us0',
  clientId: null,
  secret: null,
  x: false,
  endpoint: 'https://api.${region}.flatfile.com',
  auth: true,
})

const ConfigValidation = z.object({
  account: z.string().nullable().optional(),
  endpoint: z.string().min(1).optional(),
  env: z.string().min(1).optional(),
  region: z.string().min(1).optional(),
  clientId: z.string().min(1).nullable(),
  secret: z.string().min(1).nullable(),
  version: z.number().gte(1),
  x: z.boolean(),
  auth: z.boolean(),
  internal: z.object({}).catchall(z.string()).optional(),
})

export type Config = z.infer<typeof ConfigValidation>
