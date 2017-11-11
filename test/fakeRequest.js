/**
 * Simulates request with Promise
 * @param url URI to make a fake request. If it contains expression 'fail' then returned promise will be rejected
 * @returns {Promise}
 */
const fakeRequest = function (url) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            if (url.includes("fail"))
                reject("ERROR: Contains 'fail'");
            else
                resolve({status: 200, message: "OK"})
        }, 500)
    });
};

module.exports =  fakeRequest;