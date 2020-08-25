const moment = require('moment');
const Meeting = require('../models/Meeting');

exports.allMeetings = (req, res) =>{

    Meeting.find()
   // .sort({dateM: 'asc'})
    .exec((err, meetings)=>{
        if(err || meetings === undefined){
            res.status(400).send({
                error:"Error"
            })
        }else{
            res.status(200).send(meetings);
        }
    })
};

exports.meetingsByDate = (req, res, next,date)=>{
    if(date.trim() !== "" && date !== undefined){
        req.date = date;
        next();
    }else{
        res.status(400).send({ error: "Invalid date" });
    }
}

exports.getMeetingsByDate = (req, res)=>{
    //get te date range
    const dataRange = req.query.range;
    if(dataRange.trim().length === 0){
        res.status(400).send({ error: "Invalid date range" });
    }else{

    Meeting.find({$and : [{dateM:{ $gte : moment(req.date).startOf(dataRange).toDate()}}, {dateM:{$lte : moment(req.date).endOf(dataRange).toDate()}}]})
    .exec((err, result)=>{
        if (err || !result){
            console.log(err);
        }else{
            console.log(result);
            res.status(200).send(result);
        }
    })
}
}

const allM =(req, res)=>{
    Meeting.find()
   // .sort({dateM: 'asc'})
    .exec((err, meetings)=>{
        if(err || meetings === undefined){
            res.status(400).send({
                error:"Error"
            })
        }else{
            res.status(200).send(meetings);
        }
    })
} 

exports.newMeeting = async (req, res)=>{
    const data={};
    const aux = [];
    for (let index = 0; index < req.body.persons.length; index++) {
        aux.push({name:req.body.persons[index]})
        
    }
    data.dateM = req.body.date;
    data.description = req.body.description;
    data.persons = aux;
    data.comments = req.body.comments;
    data.user = req.body.userId;
    data.place = req.body.place;

    //console.log(req.body);
    try {
        const meeting = await new Meeting(data);
        await meeting.save();
        return res.status(200).send({
            message:"Meeting create successfuly"
        })
    } catch (error) {
        res.status(400).send({error});
        
    }

}

exports.meetingById = (req, res, next,meetingId) => {
    Meeting.findById(meetingId)
    .select("_id user._id dateM status persons description comments place updated")
    .exec((err, result)=>{
        if (err|| !result){
            return res.status(400).json({
                error: err
            })
        }else{
            req.meeting = result;
            next();
        }

    })

}

exports.meetingUpdateTopic = function(req, res, next,topic) {
    if(topic.trim() !== ""){
        req.topicM = topic;
        next();
    }else{
        res.status(400).json({
            error: "No se reconoce la accion"
        })
    }
}
const meetingSetDone =(req, res)=>{
    Meeting.findByIdAndUpdate(req.meeting._id,{$set:{status: "done",updated:Date.now()}},{new: true})
    .exec((err, result)=>{
        if(err || !result){
            res.status(400).send({
                error: err
            })
        }else{
            allM(req, res);
        }
    })
}
const meetingSetPending =(req, res)=>{
    Meeting.findByIdAndUpdate(req.meeting._id,{$set:{status: "pending",updated:Date.now()}},{new: true})
    .exec((err, result)=>{
        if(err || !result){
            res.status(400).send({
                error: err
            })
        }else{
            allM(req,res);
        }
    })
}

const meetingSetCancel =(req, res)=>{
    Meeting.findByIdAndUpdate(req.meeting._id,{$set:{status: "cancel",updated:Date.now()}},{new: true})
    .exec((err, result)=>{
        if(err || !result){
            res.status(400).send({
                error: err
            })
        }else{
            allM(req,res);
        }
    })
}


exports.meetingUpdateStatus =(req, res)=>{
    console.log(req.topicM);
    switch (req.topicM) {
        case "done":
            meetingSetDone(req,res);
            break;
        case "pending":
            meetingSetPending(req,res);
            break;
        case "cancel":
            meetingSetCancel(req,res);    
            break;
        default:
            res.status(400).send({
                error: "Accion invalida"
            })
            break;
    }
}


