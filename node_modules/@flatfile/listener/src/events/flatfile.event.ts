import { AuthenticatedClient } from './authenticated.client'
import { Event, RecordsResponseData } from '@flatfile/api'

export class FlatfileEvent extends AuthenticatedClient {
  /**
   * Event ID from the API
   *
   * @example us0_ev_82hgidh9skd
   * @readonly
   *
   */
  public readonly id?: string

  /**
   * Topic the event was produced on
   *
   * @example workbook:created
   * @readonly
   */
  public readonly topic: string
  public readonly domain: string
  public readonly target: string
  public readonly context: any
  public readonly payload: any

  constructor(private readonly src: Event) {
    super()
    this.domain = src.domain
    this.topic = src.topic
    this.context = src.context // -> [us0_acc_ihjh8943h9w, space_id, workbook_id]
    this.payload = src.payload
    this.target = src.target || ''
  }

  /**
   * Should return either event body if expanded already or fetch data from the
   * signed callback URL
   *
   * @todo this should work with the included callback URL
   */
  get data(): Promise<any> {
    const { sheetId, versionId } = this.context
    if (sheetId && versionId) {
      return this.api
        .getRecords({
          sheetId,
          versionId,
          includeCounts: false,
        })
        .then((res) => {
          return res.data
        })
    } else {
      return this.payload
    }
  }

  /**
   * Fetch the actual body of each context item referenced
   * @param _contexts
   * @todo implement when our Event context payload becomes IDs
   */
  // expand(..._contexts: string[]) {
  // await ev.expand('acccount', 'space')
  // ev.account
  // -> accounts.getAccount('id')
  // }

  /**
   * Respond with an ack progress updates
   * @param _progress
   * @todo later
   */
  // ack(_progress: number = 100) {
  //   // call ack API with error
  //   // only on ackable events
  // }
}

export type EventCallback = (evt: FlatfileEvent) => void
