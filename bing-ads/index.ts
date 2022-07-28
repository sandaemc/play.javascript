import 'dotenv/config'
import { BingAdsReportingApiSingleton } from "./bingAdsReportingApiSingleton";
import { ReportAggregation, ReportRequest, ReportTimePeriod } from "./reportRequest";
import { downloadReport, readCsvReport } from "./utility";


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
            console.log(record);


        }
    } catch (error) {
        console.error(error);
    }

})()