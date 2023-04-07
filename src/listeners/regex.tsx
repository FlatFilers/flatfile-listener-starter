/**
 * @author Maire Sangster maire@flatfile.io
 * @company Flatfile
 */

import { Blueprint } from '@flatfile/api';
import { Client, FlatfileVirtualMachine } from '@flatfile/listener';
import { RecordsUpdates } from '@flatfile/api';

/**
 * Example Client that validates emails
 */
const regExClient = Client.create((client) => {

  client.on('client:init', async () => {
    const blueprintRaw: {
      slug: string;
      name: string;
      blueprints: Blueprint[];
    } = {
      slug: 'regex-config',
      name: 'Regex Config',
      blueprints: [
        {
          slug: 'basic-config-local',
          name: 'regex blueprint',
          sheets: [
            {
              name: 'TestSheet',
              slug: 'TestSheet',
              fields: [
                {
                  key: 'email',
                  type: 'string',
                  label: 'email',
                },
              ],
            },
          ],
        },
      ],
    };

    const spaceConfig = await client.api.addSpaceConfig({
      spacePatternConfig: blueprintRaw,
    });

  })

  client.on(
    'records:*',
    // @ts-ignore
    { context: { sheetSlug: 'TestSheet' } },
    async (event) => {
      const { sheetId, versionId } = event.context;

      try {
        const {
          data: { records },
        } = await event.api.getRecords({
          sheetId,
          versionId,
        });

        const regex = new RegExp('^S+@S+$');

        if (!records) return;

        const recordsUpdates = records?.map((record: any) => {
          const isValid = regex.test(record.values.email.value);
          const messages = record.values.email.messages;

          if (!isValid) {
            record.values.email.messages = [
              ...messages,
              {
                message: 'value must contain an @',
                type: 'error',
                source: 'custom-logic',
              },
            ];
          }

          return record;
        });

        console.log('updates', { recordsUpdates });

        await event.api.updateRecords({
          sheetId,
          recordsUpdates: recordsUpdates as RecordsUpdates,
        });
      } catch (e) {
        console.log(
          `Error updating records - Use console logs inside your events to further debug: ${e}`
        );
      }
    }
  );
});

const FlatfileVM = new FlatfileVirtualMachine();

regExClient.mount(FlatfileVM);

export default regExClient;
