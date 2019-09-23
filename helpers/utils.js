const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

class Utils {
    static inDevelopment() {
        const env = process.env.NODE_ENV || 'development';
        return (env === 'development');
    }

    static getPath(base, file){
        return path.join(base, file);
    }

    static dirWalk(dir) {
        let results = [];
        const list = fs.readdirSync(dir);

        list.forEach((file) => {
            const fPath = `${dir}/${file}`;
            const stat = fs.statSync(fPath);

            if (stat && stat.isDirectory()) {
                results = results.concat(Utils.dirWalk(fPath));
            } else {
                results.push(fPath);
            }
        });

        return results;
    }

    static getDayString(timestamp) {
        const date = new Date(timestamp);
        const dayName = days[date.getDay()];

        return dayName.toLowerCase();
    }

    static parseBoolean(text) {
        if (_.isNil(text) || text.length === 0) {
            return false;
        }

        return (text.toLowerCase() === 'true');
    }

    static mapArrayToJsonByKey(array = [], key = undefined) {
        if (!array && !Array.isArray(array) && !key) {
            throw new Error('array and id are required');
        }
        const jsonObj = array.reduce((itemsObj, item) => {
            const nItemsObject = itemsObj;
            nItemsObject[item[key]] = item;
            return nItemsObject;
        }, {});
        return jsonObj;
    }

    static toObjectId(id){
        return mongoose.Types.ObjectId(id);
    }
}

module.exports = Utils;
