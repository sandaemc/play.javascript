import 'dotenv/config';
import axios, { AxiosInstance } from 'axios';
import * as crypto from 'crypto';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import dayjs from 'dayjs';

const hash = (value: string) => crypto.createHash('sha256').update(value).digest('hex');

export class Sdk {

    private readonly axios: AxiosInstance;

    constructor(private readonly accessToken: string, private readonly businessId: string) {
        this.axios = axios.create({
            baseURL: "https://graph.facebook.com/v14.0",
        });
    }

    async createEventSet(name: string, description?: string): Promise<string> {
        if (!name) {
            throw new Error("Name is required");
        }

        const { data: { id: eventSetId } } = await this.axios.post(`/${this.businessId}/offline_conversion_data_sets`, {
            access_token: this.accessToken,
            name,
            description,
        });

        return eventSetId;
    }

    // FIXME: not working need to read doc
    async assignAdAccountPermissions(eventSetId: string, adAccountId: string): Promise<void> {
        if (!eventSetId) {
            throw new Error("Event set id is required");
        }

        if (!adAccountId) {
            throw new Error("Ad account id is required");
        }

        const { data } = await this.axios.post(`/${eventSetId}/adaccounts`, {
            access_token: this.accessToken,
            business: this.businessId,
            account_id: adAccountId,
        });

        return data;
    }

    async uploadEvents(eventSetId: string, payload: string) {
        if (!eventSetId) {
            throw new Error("Event set id is required");
        }

        const { data } =  await this.axios.post(`/${eventSetId}/events`, {
            access_token: this.accessToken,
            upload_tag: 'monthly',
            data: payload,
        });

        return data;
    }

    async viewUploads(eventSetId: string) {
        if (!eventSetId) {
            throw new Error("Event set id is required");
        }

        const { data } =  await this.axios.get(`/${eventSetId}/uploads`, {
            params: {
                access_token: this.accessToken
            }
        });

        return data;
    }

    async viewStats(eventSetId: string) {
        if (!eventSetId) {
            throw new Error("Event set id is required");
        }

        const { data } =  await this.axios.get(`/${eventSetId}/stats`, {
            params: {
                access_token: this.accessToken
            }
        });

        for (const stat of data.data) {
            if (stat.count > 0) {
                console.log(stat);
            }
        }


        return data;
    }

}


(async () => {
    try {
        const sdk = new Sdk(process.env.ACCESS_TOKEN as string, process.env.BUSINESS_ID as string);

        const eventSetId = process.env.EVENT_SET_ID as string;

        const records = createReadStream('./temp/conversion.csv').pipe(parse({
            columns: false,
            skipEmptyLines: true,
            skipRecordsWithError: true
        }));

        const payload = [];
        let counter = 0;
        for await (const [createdAt, phone, email, firstName, lastName] of records) {
            payload.push({
                match_keys: {
                    phone: [hash(phone)],
                    email: [hash(email)]
                },
                event_name: 'Other',
                event_time:  dayjs(createdAt).unix()
            });

            counter++;
            if (counter > 2000) {
                break;
            }
        }

        console.log(payload);
        /*

        const response = await sdk.uploadEvents(eventSetId, JSON.stringify(payload));
        console.log(response);

        */









    } catch (error: any) {
        console.log(error.response);
    }

})();
