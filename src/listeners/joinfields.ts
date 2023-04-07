/**
 * @author Maire Sangster maire@flatfile.io
 * @company Flatfile
 */

import { Blueprint } from '@flatfile/api';
import { Client, FlatfileVirtualMachine } from '@flatfile/listener';
import { RecordsUpdates } from '@flatfile/api';

/**
 * Example Client that runs join field on action 'Join field'
 */
const joinFieldClient = Client.create((client) => {

  client.on('client:init', async () => {
    const blueprintRaw: {
      slug: string;
      name: string;
      blueprints: Blueprint[];
    } = {
      slug: 'join-field-config',
      name: 'Part 3: Join Field',
      blueprints: [
        {
          slug: 'basic-config-local',
          name: 'Join field blueprint',
          sheets: [
            {
              name: 'TestSheet',
              slug: 'TestSheet',
              fields: [
                {
                  key: 'first_name',
                  type: 'string',
                  label: 'First name',
                  constraints: [
                    {
                      type: 'required',
                    },
                  ],
                },
                {
                  key: 'last_name',
                  type: 'string',
                  label: 'last name',
                  constraints: [
                    {
                      type: 'required',
                    },
                  ],
                },
                {
                  key: 'full_name',
                  type: 'string',
                  label: 'full name',
                },
              ],
              actions: [
                {
                  slug: 'join-field',
                  label: 'Join field',
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
    'action:triggered',
    // @ts-ignore
    { context: { sheetSlug: 'TestSheet' } },
    async (event) => {
      const { sheetId, versionId } = event.context;
      // get records

      try {
        const {
          data: { records },
        } = await event.api.getRecords({
          sheetId,
          versionId,
        });

        if (!records) return;

        // Populate full name field

        const recordsUpdates = records?.map((record: any) => {
          const fullName =
            record.values['first_name'].value +
            record.values['last_name'].value;

          record.values['full_name'].value = fullName;

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

joinFieldClient.mount(FlatfileVM);

export default joinFieldClient;
