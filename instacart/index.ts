import { Sdk } from "./sdk";
import { inspect } from 'util';
import { InstacartGetServiceOptions } from "./instacartGetServiceOptions";
import { mapInstacartServiceOption } from "./instacartServiceOptionMapper";

//graphql?operationName=GetServiceOptions&variables={"cartContext":{"cartId":"599836238","numItems":3,"numUnits":4,"numConfiguredItems":0,"numConfiguredUnits":0,"alcoholic":false,"rx":false,"subtotal":{"amount":19.48,"currencyCode":"UNKNOWN"}},"retailerId":"57","addressId":"346168875","serviceType":"DELIVERY","groupBy":"date","includePlacement":true}&extensions={"persistedQuery":{"version":1,"sha256Hash":"c3799882ff37c0422f7ebe959cec497291cf541f6e3a25af1f8fb52d03fa033b"}}
const response: { data: InstacartGetServiceOptions } = require('./responses/graphql/GetServiceOptions.json');

const dump = (data: any) => console.log(inspect(data, true, null, true));


(async () => {
    try {

        const sdk = new Sdk();
        const response = await sdk.getServiceOptions();
        console.log(dump(response.data));
        const serviceOption = mapInstacartServiceOption(response.data);
        //console.log(dump(serviceOption));
        console.log(serviceOption.getCheapestOption());




    } catch (error: unknown) {
        console.error(error);
    }
})();
