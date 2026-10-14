require("dotenv").config();
const express=require("express");
const path=require("path");
const cors=require("cors");
const app=express();
app.use(cors());
app.use(express.json({limit:"100kb"}));
app.use(express.static(path.join(__dirname)));
app.get("/",(req,res)=>{res.sendFile(path.join(__dirname,"index.html"));});
app.get("/api/health",(_req,res)=>{res.json({ok:true});});
app.post("/api/chat",async(req,res)=>{
try{
if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:"API key belum dipasang"});
const messages=req.body?.messages;
const safeMessages=messages.slice(-20).map(m=>({role:m.role,content:m.content.slice(0,4000)}));
const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-4.1-mini",instructions:"Kamu Fikk AI",input:safeMessages,max_output_tokens:900})});
const data=await r.json();
const reply=data.output_text||"OK";
res.json({reply});
}catch(e){res.status(400).json({error:e.message});}
});
module.exports=app;
