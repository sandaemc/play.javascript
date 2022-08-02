import 'dotenv/config'
import { Sdk } from "./sdk";
import { inspect } from 'util';
import { InstacartGetServiceOptions } from "./instacartGetServiceOptions";
import { mapInstacartServiceOption } from "./instacartServiceOptionMapper";

const dump = (data: any) => console.log(inspect(data, true, null, false));

(async () => {
    try {
        const sdk = new Sdk();
        const response = await sdk.getDetails('07288118037239434940');

        dump(response);


    } catch (error: unknown) {
        console.error(error);
    }
})();
