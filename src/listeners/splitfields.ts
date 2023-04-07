/**
 * @author Maire Sangster maire@flatfile.io
 * @company Flatfile
 */

import { Blueprint } from '@flatfile/api';
import { Client, FlatfileVirtualMachine } from '@flatfile/listener';

/**
 * Example Client that runs split field on action 'Split field'
 */
const splitFieldClient = Client.create((client) => {

  client.on('client:init', async () => {
    const blueprintRaw: {
      slug: string;
      name: string;
      blueprints: Blueprint[];
    } = {
      slug: 'split-field-config',
      name: 'Part 6: Split Field',
      blueprints: [
        {
          slug: 'basic-config-local',
          name: 'Split field blueprint',
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
                  slug: 'split-field',
                  label: 'Split field',
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
    { context: { actionName: 'TestSheet:split-field' } },
    async (event) => {
      const { sheetId, versionId } = event.context;

      try {
        const {
          data: { records },
        } = await event.api.getRecords({
          sheetId,
          versionId,
        });

        console.log({ records });

        const recordsUpdates = records?.map((record: any) => {
          const fullName = record.values['full_name'].value;
          const splitName = fullName.split(' ');

          record.values['first_name'].value = splitName[0];
          record.values['last_name'].value = splitName[1];

          return record;
        });

        console.log({ recordsUpdates });

        await event.api.updateRecords({
          sheetId,
          recordsUpdates,
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

splitFieldClient.mount(FlatfileVM);

export default splitFieldClient;
