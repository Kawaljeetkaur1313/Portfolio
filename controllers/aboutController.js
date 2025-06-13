const aboutPage = async(req,res)=>{
    const isJson = req.query.format === 'json';
    const aboutMe =    {
        name: 'Kawaljeet Kaur',
        bio: 'Full Stack developer',
        linkedIn: "https://www.linkedin.com/in/KawaljeetKaur2024",
        Github: "https://github.com/Kawaljeetkaur1313",
        title:"About"
    }
    if(isJson){
        return res.json(aboutMe);
    }
   res.render('about', aboutMe)
}

module.exports = {aboutPage}