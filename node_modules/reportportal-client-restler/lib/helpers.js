/* eslint-disable func-names, eslint-disable no-shadow */
const rest = require('restler');
const fs = require('fs');
const glob = require('glob');

const MIN = 3;
const MAX = 256;

const getIdFormFileName = (filename) => {
    const launchNumberAndId = filename.match(/#\d+-(.*)/)[0];
    const launchIdWithExtensionTmp = launchNumberAndId.split('-')[1];
    const launchId = launchIdWithExtensionTmp.split('.')[0];

    return launchId;
};

module.exports = {
    formatName(name) {
        const len = name.length;
        // eslint-disable-next-line no-mixed-operators
        return ((len < MIN) ? (name + new Array(MIN - len + 1).join('.')) : name).slice(-MAX);
    },

    now() {
        return new Date().valueOf();
    },

    getServerResult(url, request, options, method) {
        const response = function (resolve, reject) {
            rest.json(url, request, options, method)
                .on('success', (data) => { resolve(data); })
                .on('fail', (data) => { reject(data); })
                .on('error', () => {
                    rest.json(url, request, options, method)
                        .on('success', (data) => { resolve(data); })
                        .on('fail', (data) => { reject(data); })
                        .on('error', () => {
                            rest.json(url, request, options, method)
                                .on('success', (data) => { resolve(data); })
                                .on('fail', (data) => { reject(data); })
                                .on('error', (data) => {
                                    // eslint-disable-next-line no-console
                                    console.dir(data);
                                    reject(data);
                                });
                        });
                });
        };
        return new Promise(response);
    },

    readLaunchesFromFile() {
        const files = glob.sync('rplaunch-*.tmp');
        const ids = files.map(getIdFormFileName);

        return ids;
    },

    saveLaunchIdToFile(launchName, launchNumber, launchId) {
        const filename = `rplaunch-${launchName}-#${launchNumber}-${launchId}.tmp`;
        fs.open(filename, 'w', (err) => {
            if (err) {
                throw err;
            }
        });
    },

};
