const _ = require('lodash');
const { 
    motelService,
    userService,
    eventTypeService
} = require('../../service/index.service');


const MotelController = module.exports

MotelController.motelUser = async(req, res) => {
    try {
        const googleId = req.cookies['google_account_id'];
        const typeEvents = await eventTypeService.findAll();
        let user= {
            email: ''
        };
        if(req.cookies.google_account_id) {
            user = _.get(await userService.findByGoogleAccountId(req.cookies.google_account_id), 'dataValues');
        }
    
        const motels = await motelService.getMotelsByUserId(user.id);
    
        res.render('user/post-manager', { motels, typeEvents, googleId});
    } catch (err) {
        console.error(err);
    }
}

MotelController.createNewMotel = async(req, res) => {
    const googleId = req.cookies['google_account_id'];
    const typeEvents = await eventTypeService.findAll();
    let user= {
        email: ''
    };
    if(req.cookies.google_account_id) {
        user = _.get(await userService.findByGoogleAccountId(req.cookies.google_account_id), 'dataValues');
    }
    res.render('user/create-inn-page' , { googleId, typeEvents, user });
}

MotelController.addNewMotel = async(req, res) => {
    const post = JSON.parse(JSON.stringify(req.body));
    Object.assign(post, { 
        creator_id: req.cookies['google_account_id'],
        image_slide: req.file.filename
    });

    await postService.creatorOne(post)
    res.redirect(`/account/${req.cookies['google_account_id']}`);
}