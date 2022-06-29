const _ = require('lodash');
const userService = require('../../service/user.service');

const authController = module.exports


authController.redirectURL = async(req, res) => {
    try {
        const user = {
            google_account_id: _.get(req._profile,'id'),
            email: _.get(req._profile, 'emails[0].value'),
            name: _.get(req._profile, 'displayName'),
            avatar_link: _.get(req._profile, 'photos[0].value')
        }
        const userAccount = await userService.findByGoogleAccountId(user.google_account_id);
        if (_.isNull(userAccount)) {
            await userService.createOne(user)
        }
        res.cookie('google_account_id', `${user.google_account_id}`)
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
}
