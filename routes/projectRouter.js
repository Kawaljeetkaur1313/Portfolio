const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { title } = require("process");
const 
    { 
        getProjects,
        getProjectById,
        getSearchProjects,
        getCreateProject, 
        postCreateProject, 
        deleteProject,
        getEditProject,
        postUpdateProject
    } = require("../controllers/projectController");
const projectRouter = express.Router();

//multer configuration (Directly inside the file)
const storage = multer.diskStorage({
    destination:(req,file, cb) => {
        cb(null,"public/uploads/");
    },
    filename: (req, file, cb) =>{
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const projectFilter = (req,file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if(extName && mimetype){
        cb(null, true);
    }else{
        cb(new Error("Only images (JPG, PNG, GIF) are allowed"));
    }
};
const upload = multer({
    storage,
    fileFilter: projectFilter,
    limits: {fileSize: 2 * 1024 * 1024}
})


// Serve projects page (HTML)
projectRouter.get("/", getProjects);

projectRouter.get("/create", getCreateProject);

//create a new project
projectRouter.post("/create",upload.single("screenshot"), postCreateProject);

//fetch project for editing
projectRouter.get("/:id/edit", getEditProject);

//handle project update
projectRouter.post("/:id/update", upload.single("screenshot") , postUpdateProject)

//deletee project
projectRouter.delete("/:id", deleteProject);

// Search projects (Backend Filtering)
projectRouter.get("/search", getSearchProjects);

// Project details by ID (JSON or HTML)
projectRouter.get("/:id", getProjectById);

module.exports = projectRouter;
