/**
 * @author Maire Sangster maire@flatfile.io
 * @company Flatfile
 */

import { Blueprint } from '@flatfile/api';
import { Client, FlatfileVirtualMachine } from '@flatfile/listener';

/**
 * Example Client that checks values across fields and populates based on that check
 */
const crossfieldClient = Client.create((client) => {
  client.on('client:init', async () => {
    const blueprintRaw: {
      slug: string;
      name: string;
      blueprints: Blueprint[];
    } = {
      slug: 'cross-field-config',
      name: 'Part 1: Crossfield',
      blueprints: [
        {
          slug: 'cross-field-config',
          name: 'Cross field blueprint',
          sheets: [
            {
              name: 'TestSheet',
              slug: 'TestSheet',
              fields: [
                {
                  key: 'salary',
                  type: 'number',
                  label: 'salary',
                },
                {
                  key: 'needs_raise',
                  type: 'boolean',
                  label: 'needs raise',
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

        console.log({ records });

        const recordsUpdates = records?.map((record: any) => {
          if (record.values.salary.value < 50) {
            record.values['needs_raise'].value = true;
          } else {
            record.values['needs_raise'].value = false;
          }

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

crossfieldClient.mount(FlatfileVM);

export default crossfieldClient;
