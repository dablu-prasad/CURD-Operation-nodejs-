import { noteModel } from "../models/notebookModels.js";


export const userNotes = async (req, res) => {
    try {
        const id=req.logindata.id 
        const { title, notes } = req.body
         const data = await noteModel.create({
            notetitle: title,
            notedetail:  notes,
            userid:id
            });
            data.save()    
            res.send({ "status": "Success", "message": "Note is added Successfully" })   
    } catch (error) {
        console.log(error)
        res.send({ "status": "failed", "message": "Unable to add notes" })
    }
}

export const getuserNotes = async (req, res) => {
    try {
        const id=req.logindata.id 
         const data = await noteModel.find({userid:id}) 
            res.send({data})   
    } catch (error) {
        console.log(error)
        res.send({ "status": "failed", "message": "Unable to get notes" })
    }
}

export const updateNotes = async (req, res) => {
    try {
        const id = req.params.id;
        const {notetitle,notedetail}=req.body;
        const newdata={
            notetitle:notetitle,
            notedetail:notedetail,
            userid:req.logindata.id
        }
        
            await noteModel.findByIdAndUpdate(id, newdata,{new:true});
            res.status(200).send({"message":"success",newdata})
        
        
    } catch (error) {
        console.log(error)
        res.send({ "status": "failed", "message": "Unable to update notes" })
    }
}

export const deleteNotes = async (req, res) => {
    try {
        const id=req.params.id;
        const note=await noteModel.findByIdAndRemove(id);
        res.status(202).send({note,"message":"notes delete successfully"})
    } catch (error) {
        console.log(error)
        res.send({ "status": "failed", "message": "Unable to delete notes" })
    }
}

export const getuserNotesbyid=async(req,res)=>{
    try{
        const id=req.params.id;
        const note=await noteModel.findById(id);
        res.status(202).send({note,"message":`${id} notes detail is showing`})
    } catch (error) {
        console.log(error)
        res.send({ "status": "failed", "message": "Unable to show notes details" })
    }
}