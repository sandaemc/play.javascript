import _ from 'lodash';

(async () => {
    // sort the array of integers
    const nums = [BigInt(16592875584896661), BigInt(16592875326306478), BigInt(16592875219101532)];

    const sorted = _.sortBy(nums);

    console.log({
        nums,
        sorted,
        samplesort: _.sortBy([3, 2, 1])
    });

    if (BigInt(16592875584896661) > BigInt(16592875219101532)) {
        console.log('bigger');
    }


})();
