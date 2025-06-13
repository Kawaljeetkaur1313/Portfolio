const Project = require("../models/projectModel");
const mongoose = require("mongoose");
const RequestService = require("../services/RequestService");

const getProjects = async (req, res) => {
  const projects = await Project.find().lean();
  const reqInfo = RequestService.reqHelper(req);
  //console.log("xxxx", JSON.stringify(reqInfo));
  if (req.query.format === "json") {
    return res.json(projects);
  }
  res.render("projects", {
    title: "projects",
    projects: projects,
    authenticated: reqInfo.authenticated,
    roles: reqInfo.roles,
  });
};

const getProjectById = async (req, res) => {
  const id = req.params.id;

  // Check if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid Project ID");
  }

  const project = await Project.findById(id).lean();
  //console.log(project);
  if (!project) {
    return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Project Not Found</title>
              <link rel="stylesheet" href="/css/styles.css">
          </head>
          <body>
              <header><h1>Oops! Project Not Found</h1></header>
              <main>
                  <p>Sorry, the project you are looking for does not exist.</p>
                  <p><a href="/projects">Back to Projects</a></p>
              </main>
              <footer>&copy; 2025 Kawaljeet</footer>
          </body>
          </html>
        `);
  }

  if (req.query.format === "json") {
    return res.json(project);
  }

  res.render("projectDetail", { title: project.title, project: project });
};

const getCreateProject = async (req, res) => {
  const projectId = req.params.id;

  if (projectId) {
    // Editing an existing project
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).send("Invalid Project ID");
    }
    const project = await Project.findById(projectId).lean();
    if (!project) {
      return res.status(404).send("Project not found");
    }

    return res.render("project-create", {
      title: "Edit Project",
      project, // Pass the existing project data to the template
      errorMessage: null,
    });
  }

  // Creating a new project
  res.render("project-create", {
    title: "Create Project",
    project: {}, // Empty project object for new project
    errorMessage: null,
  });
};

const postCreateProject = async (req, res) => {
  try {
    const { title, summary, description, tech } = req.body;
    const screenshot = req.file ? req.file.filename : null;

    const techArray = tech ? tech.split(",").map((t) => t.trim()) : [];

    const newProject = new Project({
      title,
      summary,
      description,
      tech: techArray,
      screenshot,
    });

    await newProject.save();
    res.redirect("/projects");
  } catch (error) {
    console.error("Error creating project:", error);
    res.render("project-create", {
      title: "Create Project",
      errorMessage: "Error creating project",
    });
  }
};

const postUpdateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, description, tech } = req.body;
    const screenshot = req.file ? req.file.filename : null;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid Project ID");
    }

    const techArray = tech ? tech.split(",").map((t) => t.trim()) : [];

    const updateData = {
      title,
      summary,
      description,
      tech: techArray,
    };

    if (screenshot) {
      updateData.screenshot = screenshot;
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProject) {
      return res.status(404).send("Project not found");
    }

    res.redirect("/projects");
  } catch (error) {
    console.log("Error updating project:", error);
    res.render("project-create", {
      title: "Edit Project",
      project: { ...req.body, _id: req.params.id }, // Pass the updated data back to the form
      errorMessage: "Error updating project",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(400).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Server errorr" });
  }
};

const getEditProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid Project ID");
  }

  const project = await Project.findById(id).lean();
  if (!project) {
    return res.status(404).send("project not found");
  }
  res.render("project-create", {
    title: "Edit Project",
    project,
    errorMessage: null,
  });
};

const getSearchProjects = async (req, res) => {
  const searchTerm = req.query.query ? req.query.query.trim() : "";
  console.log("searchTerm===>", searchTerm);

  const reqInfo = RequestService.reqHelper(req);

  const filteredProjects = await Project.find({
    $or: [
      { title: { $regex: searchTerm, $options: "i" } },
      { summary: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ],
  });

  res.render("projects", {
    title: "Search Results",
    projects: filteredProjects,
    authenticated: reqInfo.authenticated,
    roles: reqInfo.roles,
  });
};

module.exports = {
  getProjects,
  getProjectById,
  getSearchProjects,
  getCreateProject,
  postCreateProject,
  getEditProject,
  postUpdateProject,
  deleteProject,
};
