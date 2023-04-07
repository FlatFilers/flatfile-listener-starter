import { Configuration, DefaultApi } from '@flatfile/api'
import chalk from 'chalk'
import fetch from 'node-fetch'
import ora from 'ora'
import { config } from '../../config'

export async function authAction({
  apiUrl,
  clientId,
  secret,
}: {
  apiUrl: string
  clientId: string
  secret: string
}) {
  const authSpinner = ora({
    text: `Creating authenticated client`,
  }).start()
  const auth = config().auth
  const DEFAULT_API_URL = apiUrl ?? 'https://api.x.flatfile.com/v1'
  const ClientConfig = (accessToken: string) => {
    return new Configuration({
      basePath: DEFAULT_API_URL,
      fetchApi: fetch,
      accessToken,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }
  if (auth) {
    authSpinner.text = `Creating access token`

    try {
      const authClient = new DefaultApi(
        new Configuration({
          fetchApi: fetch,
          basePath: DEFAULT_API_URL,
        })
      )
      let authResponse
      try {
        authResponse = await authClient.getAccessToken({
          apiCredentials: {
            clientId,
            secret,
          },
        })
      } catch (e) {
        authSpinner.fail(`Failed to create access token`)
        console.log(e)
        process.exit(1)
      }

      if (!authResponse?.data?.accessToken) {
        authSpinner.fail(`Response did not contain access token`)
        process.exit(1)
      }
      const { accessToken } = authResponse.data
      const apiClient = new DefaultApi(ClientConfig(String(accessToken)))
      authSpinner.succeed(`Access token created`)
      return apiClient
    } catch (e) {
      console.log(e)
    }
  } else {
    try {
      const dotdotdot = '...'
      const apiClient = new DefaultApi(ClientConfig(dotdotdot))
      authSpinner.succeed(`Client created without auth enabled`)
      return apiClient
    } catch (e) {
      console.log(e)
    }
  }
}
