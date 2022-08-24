import _ from 'lodash';

(async () => {
    // sort the array of integers
    const example = 'hello';
    const simple = 'x';

    console.log({
        keys: {
            ...(simple && { simple: simple }),
            ...(example && { example: example }),
        }
    })


})();
