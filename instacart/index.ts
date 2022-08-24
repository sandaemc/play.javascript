import 'dotenv/config'
import { Sdk } from "./sdk";
import { inspect } from 'util';
import { InstacartGetServiceOptions } from "./instacartGetServiceOptions";
import { mapInstacartServiceOption } from "./instacartServiceOptionMapper";
import * as fs from 'fs';

const dump = (data: any) => inspect(data, false, null, false);

(async () => {
    try {
        const sdk = new Sdk();
        const orderId = '08108231241855535533';
        const response = await sdk.getDetails(orderId);

        const stream = fs.createWriteStream(`./temp/${orderId}.java`);
        stream.write(dump(response));
        stream.end();



    } catch (error: unknown) {
        console.error(error);
    }
})();
