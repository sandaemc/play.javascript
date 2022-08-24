import 'dotenv/config';
import { WebClient } from '@slack/web-api';

type GoGoBotPostResponse = {
    ok: boolean,
    threadLink?: string
};

export class GoGoBot {
    private static instance: GoGoBot;

    private workspaceBaseUrl: string = 'https://gogograndchildren.slack.com';
    private readonly webClient: WebClient;

    private constructor(botToken: string) {
        this.webClient = new WebClient(botToken);
    }

    static getInstance(): GoGoBot {
        if (!process.env.SLACK_BOT_TOKEN) {
            throw new Error('SLACK_BOT_TOKEN is not set');
        }

        if (!GoGoBot.instance) {
            GoGoBot.instance = new GoGoBot(process.env.SLACK_BOT_TOKEN as string);
        }

        return GoGoBot.instance;
    }

    async post(channel: string, payload: any): Promise<GoGoBotPostResponse> {
        const response = await this.webClient.chat.postMessage({ channel, ...payload });

        const threadId = response.ts?.replace(/\./g, '');

        return {
            ok: response.ok,
            ...(threadId ? { threadLink: `${this.workspaceBaseUrl}/archives/${channel}/p${threadId}` } : {})
        }
    }
}

(async () => {
    const bot = GoGoBot.getInstance();

    const response = await bot.post('C03TVC3500P', {
            username: 'Other Circumstances',
            icon_emoji: ':exclamation:',
            text: 'Hi <@U034M3HPMS9> you where tagged because we need your feedback to resolve a customers Other Circumstances complaint.\n' + 'Tagging <@UMMKZ7Z1N>',
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: ':exclamation: Other Circumstances',
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: 'Hi <@U034M3HPMS9> you where tagged because we need your feedback to resolve a customers Other Circumstances complaint.\n' + 'Tagging <@UMMKZ7Z1N>',
                    }

                }
            ],
            attachments: [
              {
                fallback: 'Hi <@U034M3HPMS9> you where tagged because we need your feedback to resolve a customers Other Circumstances complaint.\n' +
                  'Tagging <@UMMKZ7Z1N>',
                fields: [
                    {
                        title: 'Order processed by',
                        value: 'Sandae Macalalag',
                        short: true
                      },
                      {
                        title: 'NL submitted by',
                        value: 'Sandae Macalalag',
                        short: true
                      },
                      {
                        title: 'Who made the Error',
                        value: 'Instacart Shopper',
                        short: true
                      },
                      {
                        title: "Customer's Name",
                        value: 'Stephen Mastroianni',
                        short: true
                      },
                      {
                        title: "Customer's Phone Number",
                        value: '18507886559',
                        short: true
                      },
                      {
                        title: 'IC Order number',
                        value: '07278113403636635763',
                        short: true
                      },
                      {
                        title: 'IC E-Mail',
                        value: 'gogo023@gogograndparent.com',
                        short: true
                      },
                      { title: 'Call Log Id', value: '232323', short: true },
                      {
                      },
                      { title: 'Call Log Id', value: '232323', short: true },
                      {
                        title: 'What is the customers issue about',
                        short: true
                      },
                      { title: 'Call Log Id', value: '232323', short: true },
                      {
                        title: 'What is the customers issue about',
                        value: 'Did not enter proper replacement Item',
                        short: true
                      },
                      { title: 'Details', value: '24241', short: true },
                      {
                        title: 'Incorrect Item(s): description & Cost per Item',
                        value: '141421',
                        short: true
                      },
                      {
                        title: 'Correct Item(s): description & Cost per Item',
                        value: '3131233',
                        short: true
                      },
                      {
                        title: '',
                        value: '<https://app.gogograndparent.com/operator/grocery-history?groceryOrderId=07278113403636635763#grocery-details | Open Details in DB>',
                        short: false
                      }
                ],
                actions: undefined,
                image_url: undefined
              }
            ]
    });

    console.log(response);

})();
