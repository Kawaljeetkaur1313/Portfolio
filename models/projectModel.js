const mongoose = require('mongoose');

// Define the Project schema
const projectSchema = new mongoose.Schema(
  {
  title: { type: String, required: true },
  summary: { type: String, required: true },
  description: { type: String, required:true },
  screenshot: { type: String, required: false },
  tech: [String],
 }
);

// Create the model based on the schema
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
