/**
 * Simulates request with Promise
 * @param options Options json with URI to make a fake request.
 * If it contains expression 'fail' then will returned rejected promise
 * @returns {Promise} Promise, which is rejectetd if option's uri contains fail, otherwise - resolved
 */
const fakeRequest = function (options) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            if (options.uri.includes("fail"))
                reject({status: 418, message: "Tea Poat contains fail (("});
            else
                resolve({status: 200, message: "OK"})
        }, 500)
    });
};

module.exports =  fakeRequest;