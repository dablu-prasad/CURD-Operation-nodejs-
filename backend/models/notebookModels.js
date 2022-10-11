import mongoose from "mongoose";
import validator from "validator";

const notebookSchema = new mongoose.Schema({
  notetitle: {
    type: String,
    required: ["Please Enter Note Title"],
    maxLength: [30, "Name cannot exceed 30 characters"],
  },
  notedetail: {
    type: String,
    required: ["Please Enter Note Detsil"],
  },
  userid: {
    type: String,
    required: true,
  },
  
});

export const noteModel = mongoose.model("notebookDetail", notebookSchema);
