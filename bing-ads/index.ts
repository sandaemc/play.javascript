import 'dotenv/config'
import { BingAdsReportingApiSingleton } from "./bingAdsReportingApiSingleton";
import { ReportAggregation, ReportRequest, ReportTimePeriod } from "./reportRequest";
import { downloadReport, readCsvReport } from "./utility";
import moment from 'moment-timezone';

console.log({
    yesterday: moment().utc().subtract(1, 'day').endOf('day').format(),
    today: moment().utc().format(),
});