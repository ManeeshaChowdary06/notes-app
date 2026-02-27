import React,{useState,useEffect} from "react";
import API from "./axios";
import {useNavigate,useLocation} from "react-router-dom";

export default function CreateNote(){

const navigate=useNavigate();
const location=useLocation();
const editNote=location.state;

const[title,setTitle]=useState("");
const[content,setContent]=useState("");

useEffect(()=>{
if(editNote){
setTitle(editNote.title);
setContent(editNote.content);
}
},[]);}

const saveNote=async()=>{

if(editNote){

await API.put(`/notes/${editNote.id}`,{
title,
content,
pinned:editNote.pinned??false
});

}else{

await API.post("/notes/",{
title,
content,
pinned:false
});

}

navigate("/home");

};