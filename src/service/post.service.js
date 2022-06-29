const { post } = require('../models');

const PostService = module.exports;

PostService.filterByCreatorId = async(id)=> await post.findAll({where: { creator_id: id}})

PostService.creatorOne = async(one)=> await post.create(one);

PostService.deleteById = async(id) => await post.destroy({where: {id}})

PostService.findById = async(id) => await post.findOne({where: {id}})

PostService.updateById = async(option, id) => await post.update(option, {where: {id}})

PostService.findAll = async(option) => await post.findAll({
    where: option
});

PostService.findByStatus = async(status) => await post.findAll({ where:{ status }})

PostService.filterConfirm = async(option) => await post.findAll({
    where: option
});