
// Dependencies
import { BingAdsReportingApi } from './bingAdsReportingApi';
import { MicrosoftOAuthApi } from './microsoftOAuthApi';

export class BingAdsReportingApiSingleton {

  private static instance: BingAdsReportingApi;

  static async getInstance() {
    if (!BingAdsReportingApiSingleton.instance) {
      const oauthApi = new MicrosoftOAuthApi({
        client: {
          id: process.env.APP_CLIENT_ID as string,
          secret: process.env.APP_CLIENT_SECRET as string
        },
        scope: 'https://ads.microsoft.com/msads.manage offline_access',
      });

      const token = await oauthApi.refreshAccessToken(process.env.REFRESH_TOKEN as string);

      this.instance =  await BingAdsReportingApi.createInstance({
        developerToken: process.env.DEVELOPER_TOKEN as string,
        accessToken: token.accessToken,
        customer: {
          id: process.env.CUSTOMER_ID as string,
          accountId: process.env.CUSTOMER_ACCOUNT_ID as string,
        },
      });
    }

    return this.instance;
  }

}
