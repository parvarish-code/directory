const jwt = require('jsonwebtoken');
const Member = require('../models/member');

const isAdmin = async(req,res,next) => {
    try {
        const token = req.header('Authorization').replace('Bearer','');
        const decoded = jst.verify(token,'code everything');
        const member = await Member.findById(decoded.userId);
        if(!member || !member.isAdmin){
            return res.status(403).json({ error:'Forbidden.Admin access required'});
        }
        req.member = member;
        next();
    } catch (error) {
        res.status(401).json({ error:'Not Authorized'});
    }
}

module.exports = isAdmin;