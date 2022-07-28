import { Client, createClientAsync } from 'soap';
import { InferType, object, string } from 'yup';
import { xml2js } from 'xml-js';
import { ReportRequest } from './reportRequest';

const customerInfoSchema = object({
  id: string().required(),
  accountId: string().required(),
});

const bingAdsReportConfigSchema = object({
  developerToken: string().required(),
  accessToken: string().required(),
  customer: customerInfoSchema.required(),
});

type BingAdsReportConfig = InferType<typeof bingAdsReportConfigSchema>;

const buildBingAdsReportConfig = (config: BingAdsReportConfig) => bingAdsReportConfigSchema.validate(config);

type ReportRequestStatus = 'pending' | 'success' | 'error';

type ReportRequestStatusResponse = {
  status: ReportRequestStatus,
  reportDownloadUrl?: string,
};

const interceptor = (xml: unknown) => {
  console.log(xml);

  return xml;
};

export class BingAdsReportingApi {
  private WSDL_URL = 'https://reporting.api.bingads.microsoft.com/Api/Advertiser/Reporting/V13/ReportingService.svc?singleWsdl';
  private NAMESPACE_ABBRV = 'tns';
  private client!: Client;

  private constructor(private readonly config: BingAdsReportConfig) {
    if (!config) {
      throw new Error('NullArgumentError: config is required');
    }
  }

  private addHeaders() {
    this.client.addSoapHeader({
      DeveloperToken: this.config.developerToken,
      CustomerId: this.config.customer.id,
      CustomerAccountId: this.config.customer.accountId,
      AuthenticationToken: this.config.accessToken,
    }, '', this.NAMESPACE_ABBRV);
  }

  private async init() {
    this.client = await createClientAsync(this.WSDL_URL, { namespaceArrayElements: false  });
    this.addHeaders();
  }

  static async createInstance(config: BingAdsReportConfig): Promise<BingAdsReportingApi> {
    const bingAdsReportConfig = await buildBingAdsReportConfig(config);
    const api = new BingAdsReportingApi(bingAdsReportConfig);
    await api.init();

    return api;
  }

  async getReportStatus(reportRequestId: string): Promise<ReportRequestStatusResponse> {
    const response = await this.client.PollGenerateReportAsync({
      ReportRequestId: reportRequestId,
    });

    const json: any = xml2js(
      response[1], {
        compact: true,
        ignoreAttributes: true,
        ignoreComment: true,
      },
    );

    return {
      status: json['s:Envelope']['s:Body'].PollGenerateReportResponse.ReportRequestStatus.Status._text.toLowerCase(),
      reportDownloadUrl: json['s:Envelope']['s:Body'].PollGenerateReportResponse.ReportRequestStatus.ReportDownloadUrl._text,
    };
  }

  async submitReportRequest(request: ReportRequest): Promise<string> {
    const response = await this.client.SubmitGenerateReportAsync(request.build(), { postProcess: interceptor });

    const json: any = xml2js(
      response[1], {
        compact: true,
        ignoreAttributes: true,
        ignoreComment: true,
      },
    );

    return json['s:Envelope']['s:Body'].SubmitGenerateReportResponse.ReportRequestId._text;
  }
}
