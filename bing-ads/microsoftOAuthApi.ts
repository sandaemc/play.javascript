import axios, { AxiosInstance } from 'axios';
import { stringify } from 'querystring';
import { InferType, number, object, string } from 'yup';

const appInfoSchema = object({
  id: string().required(),
  secret: string().required(),
});

const bingAdsOAuthConfigSchema = object({
  client: appInfoSchema.required(),
  scope: string().required(),
});

type BingAdsOAuthConfig = InferType<typeof bingAdsOAuthConfigSchema>;

const baseOAuthResponseSchema = object({
  tokenType: string().required(),
  scope: string().required(),
  expiresIn: number().required(),
  extExpiresIn: number().required(),
  accessToken: string().required(),
  refreshToken: string().required(),
}).camelCase();

const refreshOAuthResponseSchema = object({
  tokenType: string().required(),
  scope: string().required(),
  expiresIn: number().required(),
  extExpiresIn: number().required(),
  accessToken: string().required(),
}).camelCase();

type BingAdsOAuthResponse = InferType<typeof baseOAuthResponseSchema>;
type BingAdsOAuthRefreshResponse = InferType<typeof refreshOAuthResponseSchema>;

export class MicrosoftOAuthApi {
  private readonly axiosInstance: AxiosInstance;
  private readonly BASE_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0';

  constructor(private readonly config: BingAdsOAuthConfig) {
    if (!config) {
      throw new Error('NullArgumentError: config is required');
    }

    this.axiosInstance = axios.create({
      baseURL: this.BASE_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  async requestAccessToken(authorizationCode: string, redirectUri: string): Promise<BingAdsOAuthResponse> {
    if (!authorizationCode) {
      throw new Error('NullArgumentError: authorizationCode is required');
    }

    const { data } = await this.axiosInstance.post('/token', stringify({
      client_id: this.config.client.id,
      client_secret: this.config.client.secret,
      grant_type: 'authorization_code',
      scope: this.config.scope,
      code: authorizationCode,
      redirect_uri: redirectUri,
    }));

    return baseOAuthResponseSchema.validate(data);
  }

  async refreshAccessToken(refreshToken: string): Promise<BingAdsOAuthRefreshResponse> {
    if (!refreshToken) {
      throw new Error('NullArgumentError: refreshToken is required');
    }

    const { data } = await this.axiosInstance.post('/token', stringify({
      client_id: this.config.client.id,
      client_secret: this.config.client.secret,
      grant_type: 'refresh_token',
      scope: this.config.scope,
      refresh_token: refreshToken,
    }));

    return refreshOAuthResponseSchema.validate(data);
  }
}
