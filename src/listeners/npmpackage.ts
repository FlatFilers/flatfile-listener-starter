/**
 * @author Maire Sangster maire@flatfile.io
 * @company Flatfile
 */

import { Blueprint } from '@flatfile/api';
import { Client, FlatfileVirtualMachine } from '@flatfile/listener';
import { RecordsUpdates } from '@flatfile/api';
import Color from 'color';

/**
 * Example Client that gets hex value of color-string
 */
const npmPackageClient = Client.create((client) => {

  client.on('client:init', async () => {
    const blueprintRaw: {
      slug: string;
      name: string;
      blueprints: Blueprint[];
    } = {
      slug: 'npm-package-config',
      name: 'Part 4: NPM Package',
      blueprints: [
        {
          slug: 'npm-package-config',
          name: 'npm package blueprint',
          sheets: [
            {
              name: 'TestSheet',
              slug: 'TestSheet',
              fields: [
                {
                  key: 'color',
                  type: 'string',
                  label: 'Color',
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
      // get records

      try {
        const {
          data: { records },
        } = await event.api.getRecords({
          sheetId,
          versionId,
        });

        if (!records) return;

        const recordsUpdates = records?.map((record: any) => {
          const newColor = Color(record.values.color.value).hex();
          record.values.color.value = newColor;

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

npmPackageClient.mount(FlatfileVM);

export default npmPackageClient;
