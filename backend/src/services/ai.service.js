require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-3.6-flash",
    systemInstruction:`
    
    you are an code reviewer,who have an experties in development.you look for the code and find the problems and suggest the solution
    to the developer.
    you always try to find the best solution for the developer and also try to make the code more efficient and clean.
    `
    
});



async function generateContent(code){
    const result=await model.generateContent(code);
    console.log('result ',result.response.text());
    return result.response.text();
}
module.exports=generateContent;