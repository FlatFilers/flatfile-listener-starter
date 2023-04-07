import { EventDriver } from './_EventDriver'

export class PollingEventDriver extends EventDriver {
  constructor(private options: { interval: number; environmentId: string }) {
    super()
  }

  start() {
    let lastTimestamp = new Date()
    setInterval(() => {
      this.handler.api
        .getEvents({
          since: lastTimestamp,
          environmentId: this.options.environmentId,
        })
        .then((res) => {
          process.stdout.cursorTo(0)
          process.stdout.clearLine(1)
          process.stdout.write(
            `→ checked events at ${lastTimestamp.toISOString()} — ${
              res.data?.length || 0
            } found\n`
          )
          res.data?.forEach((e) => {
            this.dispatchEvent(e)
          })
        })
        .catch(console.error)

      lastTimestamp = new Date()
    }, this.options.interval)
  }

  shutdown() {}
}
