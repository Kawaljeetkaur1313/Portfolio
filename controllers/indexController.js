const { RequestService } = require("../services/RequestService");

const indexPage = async(req,res)=>{
    const isJson = req.query.format === 'json';
    if(isJson){
        return res.json({message: "Welcome to my Node.js Portfolio!!"});
    }

    res.render("index",{title:"Home"});
}

module.exports = {indexPage}