/**
 * The Client
 *
 * The Flatfile PubSub Client is just a simple event subscriber. It can
 * receive events from any PubSub driver. The default drivers are:
 *
 * - Webhook    (for simply processing events sent to URL)
 * - Websocket  (for subscribing real time on an HTTP2 connection)
 * - Serverless (for stateless invocations via AWS Lambda or similar)
 *
 * Once an event is received, it is routed to any awaiting listeners which
 * are added with `addEventListener()` or its alias `on()`.
 *
 * Flatfile events follow a standard structure and event listeners can use
 * any of the following syntaxes to react to events within Flatfile.
 *
 * // listen to an event
 * addEventListener('entity:topic')
 *
 * // listen to an event on a specific namespace
 * addEventListener('entity:topic@namespace')
 *
 * // listen to a specific context on a namespace
 * addEventListener('entity:topic@namespace?context=us_sp_89234oihsdo')
 *
 * // filter by any
 * addEventListener('entity:topic@namespace?')
 *
 */

import { EventFilter, EventHandler } from './events'
import { EventDriver } from './event-drivers/_EventDriver'

export class Client extends EventHandler {
  /**
   * Subscribe to events only within a certain namespace.
   *
   * @param namespace
   * @param cb
   */
  namespace(namespace: string | string[], cb?: SubFn) {
    return this.filter({ namespace }, cb)
  }

  /**
   * Filter by namespace
   *
   * @param filter
   * @param cb
   */
  filter(filter: EventFilter, cb?: SubFn) {
    const client = new Client(filter)
    this.addNode(client)
    cb?.(client)
    return client
  }

  setupFunctions: Array<(...args: any[]) => void> = []
  public beforeMount(cb: SubFn) {
    this.setupFunctions.push(cb)
  }

  /**
   * Start subscribing to events
   *
   * @param cb
   */
  public static create(cb: SubFn): Client {
    const client = new Client()
    client.beforeMount(() => cb(client))
    return client
  }

  /**
   * Mount this client using an acceptable Event Driver
   */
  mount(driver: EventDriver) {
    this.setupFunctions.forEach((f) => f())
    driver.mountEventHandler(this)
    return this
  }
}

type SubFn = (client: Client) => void
