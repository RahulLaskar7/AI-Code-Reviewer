const aiService=require("../services/ai.service")



module.exports.getReview=async (req,res)=>{
    const code=req.body.code;
    if(!code){
        return res.status(400).send("prompt is required");
        // return res.status(404).json({message:'there is some error'});
    }
    // console.log('reached here')
    const response=await aiService(code);
    // console.log(response);
    res.send(response);
}