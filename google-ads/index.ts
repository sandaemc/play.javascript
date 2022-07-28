import 'dotenv/config'
import { GoogleAdsApi } from "google-ads-api";
import moment from 'moment-timezone';

(async () => {
    try {
        const client = new GoogleAdsApi({
            client_id: process.env.APP_CLIENT_ID as string,
            client_secret: process.env.APP_CLIENT_SECRET as string,
            developer_token: process.env.DEVELOPER_TOKEN as string
        });

        const customer = client.Customer({
            customer_id: process.env.CUSTOMER_ID as string,
            login_customer_id: process.env.LOGIN_CUSTOMER_ID,
            refresh_token: process.env.REFRESH_TOKEN as string,
        });

        const response = await customer.query(`
                SELECT
                campaign.id,
                campaign.name,
                campaign.status,
                ad_group.id,
                ad_group.name,
                ad_group.status,
                customer.id,
                customer.descriptive_name,
                customer.status,
                call_view.call_duration_seconds,
                call_view.caller_area_code,
                call_view.caller_country_code,
                call_view.end_call_date_time,
                call_view.start_call_date_time
            FROM call_view
            WHERE call_view.end_call_date_time DURING YESTERDAY
        `);

        const convertPSTToUTC = (date: string) => {
            return moment.tz(date, 'America/Los_Angeles').utc();
        };

        for (const { call_view } of response) {
            const startTimePst = call_view?.start_call_date_time ? moment.tz(call_view.start_call_date_time, 'America/Los_Angeles') : null;
            const startTimeBangkok = call_view?.start_call_date_time ? moment.tz(call_view.start_call_date_time, 'Asia/Bangkok') : null;

            console.log({
                startTime: [call_view?.start_call_date_time,  startTimePst, convertPSTToUTC(call_view?.start_call_date_time as string), startTimePst?.toDate()],
            });
        }

        console.log({
            pst: moment.tz(new Date(), 'America/Los_Angeles'),
            utc: moment.utc(),
        });

    } catch (error: unknown) {
        console.error(error);

    }
})()