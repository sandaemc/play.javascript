import 'dotenv/config'
import { GoogleAdsApi } from "google-ads-api";
import moment from 'moment-timezone';

const convertPSTToUTC = (date: string) => {
    return moment.tz(date, 'America/Los_Angeles').utc();
};

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

        const from = moment('2022-07-20').format('YYYY-MM-DD');
        const to = moment('2022-07-21').format('YYYY-MM-DD');

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
                customer.time_zone,
                customer.status,
                call_view.call_duration_seconds,
                call_view.caller_area_code,
                call_view.caller_country_code,
                call_view.end_call_date_time,
                call_view.start_call_date_time
            FROM call_view
            WHERE call_view.end_call_date_time BETWEEN '${from}' AND '${to}'
        `);


        for (const { call_view, campaign, customer, ad_group } of response) {
            const startTimePst = call_view?.start_call_date_time ? moment.tz(call_view.start_call_date_time, 'America/Los_Angeles') : null;

            const record = {
                accountId: customer?.id,
                accountName: customer?.descriptive_name,
                accountStatus: customer?.status,
                campaignId: campaign?.id,
                campaignName: campaign?.name,
                campaignStatus: campaign?.status,
                adGroupId: ad_group?.id,
                adGroupName: ad_group?.name,
                adGroupStatus: ad_group?.status,
                duration: call_view?.call_duration_seconds,
                countryCode: call_view?.caller_country_code,
                areaCode: call_view?.caller_area_code,
                startTime: call_view?.start_call_date_time,
                endTime: call_view?.end_call_date_time,
                timezone: customer?.time_zone
            };

            console.log({
                startTime: call_view?.start_call_date_time,
                startTimeToDate: call_view?.start_call_date_time ? new Date(call_view?.start_call_date_time) : null,
                startTimeToMomentToDate: moment(call_view?.start_call_date_time).toDate(),
                startTimeToMomentToUTCToDate:  call_view?.start_call_date_time ? convertPSTToUTC(call_view?.start_call_date_time).toDate() : null,
            });
        }

        console.log({
            pst: moment.tz('2022-07-20 06:27:01', 'America/Los_Angeles'),
            utc: moment.tz('2022-07-20 06:27:01', 'America/Los_Angeles').utc().toDate(),
        });

    } catch (error: unknown) {
        console.error(error);

    }
})()
