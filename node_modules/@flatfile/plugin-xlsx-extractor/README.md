## XLSX Extractor Plugin

This parses all Sheets in an XLSX file and extracts them into X. Here's an example of how to use it:

```ts
SpaceConfig1.on([EventTopic.Uploadcompleted], (event) => {
  return new ExcelExtractor(event).runExtraction()
})
```

The Extractor can accept an addition options parameter that includes `rawNumbers: boolean` which will be passed along to the Sheet.js parsing engine.

```ts
SpaceConfig1.on([EventTopic.Uploadcompleted], (event) => {
  return new ExcelExtractor(event, { rawNumbers: true }).runExtraction()
})
```
