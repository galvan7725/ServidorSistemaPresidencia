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