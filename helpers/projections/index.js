const Projection = require('./projection');

const baseUserLogin = '_id first_name last_name email job_title company gender birth_date country city mobile profile_image';
const baseUserBasicData = '_id first_name last_name email job_title company gender birth_date country city mobile profile_image';
module.exports = {
    pUserLogin: new Projection(baseUserLogin),
    pUserBasicData: new Projection(baseUserBasicData),
};
