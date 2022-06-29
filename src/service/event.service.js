const _ = require('lodash');

const eventService = module.exports

eventService.transformBlob = async (data) => {
    const base = Buffer.from(data.image);
    const conversion = base.toString('base64');
    const send = "data:image/png;base64,"+conversion;
    _.set(data, 'image', send);
}