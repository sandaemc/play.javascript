import 'dotenv/config';
import axios, { AxiosInstance } from 'axios';
import * as crypto from 'crypto';

const hash = crypto.createHash('sha256').update('13037760116').digest('hex');


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

    async uploadEvents(eventSetId: string) {
        if (!eventSetId) {
            throw new Error("Event set id is required");
        }

        const { data } =  await this.axios.post(`/${eventSetId}/events`, {
            access_token: this.accessToken,
            upload_tag: 'monthly',
            data: JSON.stringify([
                {
                    match_keys: { phone: [hash]},
                    event_time: '1659219846',
                    event_name: 'Other',
                }
            ])
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

        return data;
    }

}


(async () => {
    try {
        const sdk = new Sdk(process.env.ACCESS_TOKEN as string, process.env.BUSINESS_ID as string);

        //const eventSetId = await sdk.createEventSet("My Event Set 101");
        const eventSetId = '1101249530492071';
        //const data = await sdk.assignAdAccountPermissions(eventSetId, process.env.AD_ACCOUNT_ID as string);

        const data = await sdk.viewUploads(eventSetId);
        console.log(data);






    } catch (error: any) {
        console.log(error.response);
    }

})();
