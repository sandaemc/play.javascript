// Dependencies
import download from 'download';
import * as os from 'os';
import * as path from 'path';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';

// Api Clients
import { BingAdsReportingApi } from './bingAdsReportingApi';

export const sleep = (millis: number) => {
    return new Promise(resolve => setTimeout(resolve, millis));
};


export const downloadReport = async (reportingApi: BingAdsReportingApi, reportRequestId: string) => {
  let reportStatus = await reportingApi.getReportStatus(reportRequestId);
  const maxTries = 10;
  let tries = 0;

  while (reportStatus.status !== 'success') {
    await sleep(1000);

    reportStatus = await reportingApi.getReportStatus(reportRequestId);

    tries++;
    if (tries >= maxTries) {
      throw new Error(`Failed to download report after ${maxTries} tries`);
    }
  }

  if (!reportStatus.reportDownloadUrl) {
    throw new Error('Report download URL not found');
  }

  await download(reportStatus.reportDownloadUrl, os.tmpdir(), { extract: true });

  const csvFileName = reportRequestId.split('_')[0] + '.csv';
  return path.join(os.tmpdir(), csvFileName);
};

export const readCsvReport = (csvFileName: string) => createReadStream(csvFileName)
  .pipe(
    parse({
      columns: true,
      skipEmptyLines: true,
      from_line: 11, // There are custom headers generated on the first 10 lines
      skipRecordsWithError: true,
    }),
  );
