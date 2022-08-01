import 'dotenv/config'
import { BingAdsReportingApiSingleton } from "./bingAdsReportingApiSingleton";
import { ReportAggregation, ReportRequest, ReportTimePeriod } from "./reportRequest";
import { downloadReport, readCsvReport } from "./utility";
import moment from 'moment-timezone';


(async () => {
    try {
        const reportingApi = await BingAdsReportingApiSingleton.getInstance();

        const request = ReportRequest.newCallDetailReport()
            .setAccountId(process.env.CUSTOMER_ACCOUNT_ID as string)
            .setReportTimePeriod(ReportTimePeriod.LastSevenDays)
            .setReportAggregation(ReportAggregation.Daily);

        const reportRequestId = await reportingApi.submitReportRequest(request);

        const fileName = await downloadReport(reportingApi, reportRequestId);

        const records = readCsvReport(fileName);

        for await (const record of records) {
            console.log({
                raw: record.StartTime,
                startTime: moment(record.StartTime).format('YYYY-MM-DD HH:mm:ss'),
                startTimeDate: moment(record.StartTime).toDate(),
                startTimeUTC: moment.utc(record.StartTime).toDate()
            })
        }
    } catch (error) {
        console.error(error);
    }

})()