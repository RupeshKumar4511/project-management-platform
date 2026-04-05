import  {matchedData, validationResult}  from 'express-validator';

export const schemaValidation = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({message:errors.array()[0].msg,error:errors.array()})
    }
    req.body = matchedData(req,{locations:['body']})
    req.params = matchedData(req,{locations:['params']})

    next()
}