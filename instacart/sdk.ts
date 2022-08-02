import axios, {AxiosInstance} from 'axios';

export class Sdk {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: 'https://www.instacart.com',
            headers: {
                Cookie: process.env.COOKIE as string
            }
        });
    }

    async getServiceOptions() {
//graphql?operationName=GetServiceOptions&variables={"cartContext":{"cartId":"599836238","numItems":3,"numUnits":4,"numConfiguredItems":0,"numConfiguredUnits":0,"alcoholic":false,"rx":false,"subtotal":{"amount":19.48,"currencyCode":"UNKNOWN"}},"retailerId":"57","addressId":"346168875","serviceType":"DELIVERY","groupBy":"date","includePlacement":true}&extensions={"persistedQuery":{"version":1,"sha256Hash":"c3799882ff37c0422f7ebe959cec497291cf541f6e3a25af1f8fb52d03fa033b"}}
        const { data } = await this.instance.get('/graphql', {
            params: {
                operationName: 'GetServiceOption',
                variables: {
                    cartContext: {
                        cartId: '585416520',
                        subtotal: {
                            amount: 0,
                            currencyCode: "UNKNOWN"
                        }
                    },
                    retailerId: 57,
                    addressId: '346168875',
                    serviceType: 'DELIVERY',
                    groupBy: 'date',
                    includePlacement: true,
                },
                extensions: {
                    persistedQuery:{
                        version:1,
                        sha256Hash:"c3799882ff37c0422f7ebe959cec497291cf541f6e3a25af1f8fb52d03fa033b"
                    }
                }
            }
        });

        return data;
    }

    async getDetails(orderId: string) {
        const id = orderId.length >= 20 ? orderId.slice(4) : orderId;

        const { data } = await this.instance.get(`api/v2/orders/${id}`, {
            params: {
                source: 'web',
                replacement_options: true
            }
        })

        return data;
    }

    async getDeliveryTimeOptions() {
        const storeId = 57; // retailer id
        const { data } = await this.instance.get(`/v3/retailers/${storeId}/delivery_options`, {
            params: {
                address_id: 346168875,
                cache_delivery_options: true,
                source: 'web',
            }
        });

        return data;
    }

    async getItems() {
        const { data } = await this.instance.get('/graphql', {
            params: {
                "operationName": "Items",
                "variables": {
                    "ids": [
                        "items_36393-42429",
                        "items_36393-42378",
                    ]
                },
                "extensions": {
                    "persistedQuery": {
                        "version": 1,
                        "sha256Hash": "32c6c575f51c388f084d4ff6511f55d767f4453403e6176c1340b889620f29a6"
                    }
                }
            }
        });

        return data.data.items;
    }
}
