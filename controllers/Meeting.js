const Meeting = require('../models/Meeting');

exports.allMeetings = (req, res) =>{

    Meeting.find().exec((err, meetings)=>{
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
    const data = req.body;
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