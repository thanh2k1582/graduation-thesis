const express = require('express');
const router = express.Router();
const homeController = require('../controllers/user/home.controller');
const InnController = require('../controllers/user/inn.controller');

const { upload } = require('../helpers/multer');

// profile
router.post('/edit-profile', upload.single('uploaded_file'), homeController.editProfile);
router.get('/edit-profile', homeController.profile);

// inn
router.get('/:googleId/edit/:id', InnController.editDetailPost);
router.post('/delete-inn-post', InnController.deleteInnPost);
router.get('/post/detail', InnController.postDetail);
router.post('/post/detail/report', InnController.postReport);
router.post('/post/edit', upload.array('uploaded_file'), InnController.postEdit);
router.post('/add-new-inn',upload.array('uploaded_file'), InnController.addNewInn);
router.get('/account/:googleId/:id/', InnController.detailPost);
router.get('/create-inn', InnController.pageCreateInn);
router.get('/manager/:googleId', InnController.managerMotel);
router.get('/detail/:googleId/:id', InnController.detailMotel);

router.get('/DaNang-inns', InnController.DaNangInns);
router.get('/BinhSon-inns', InnController.BinhSonInns);
router.get('/all-inns', InnController.allInns);
router.post('/all-inns/search', InnController.allInnsSearch);

// event
router.get('/happening-event/:slug', homeController.happeningEvent);
router.get('/inns/:id', homeController.innDetail);
router.get('/post/:id', homeController.postDetail);
router.post('/register-event', homeController.registerEvent);
router.get('/logout', homeController.logout);
router.get('/:slug', homeController.slug);
router.get('/', homeController.homepage);

module.exports = router;
