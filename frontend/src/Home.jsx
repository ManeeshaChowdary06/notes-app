import React,{useEffect,useState} from "react";
import API from "./axios";
import {useNavigate} from "react-router-dom";

export default function Home(){

const[notes,setNotes]=useState([]);
const[search,setSearch]=useState("");
const[selected,setSelected]=useState(null);
const[viewNote,setViewNote]=useState(null);
const[showCreate,setShowCreate]=useState(false);

const[title,setTitle]=useState("");
const[content,setContent]=useState("");
const[imageFile,setImageFile]=useState(null);

const navigate=useNavigate();

useEffect(()=>{
if(search.trim()===""){
loadNotes();
}else{
searchNotes();
}
},[search]);

const loadNotes=async()=>{
const res=await API.get("/notes/");
setNotes(res.data);
};
const searchNotes=async()=>{
const res=await API.get(`/notes/search?query=${search}`);
setNotes(res.data);
};

const logout=()=>{
localStorage.removeItem("token");
navigate("/login");
};

const deleteNote=async(id)=>{
await API.delete(`/notes/${id}`);
loadNotes();
};

const createNote=async()=>{
const formData=new FormData();
formData.append("title",title);
formData.append("content",content);
if(imageFile){
formData.append("image",imageFile);
}
await API.post("/notes/",formData,{
headers:{ "Content-Type":"multipart/form-data" }
});
setShowCreate(false);
setTitle("");
setContent("");
setImageFile(null);
loadNotes();
};

const updateNote=async()=>{
const formData=new FormData();
formData.append("title",selected.title);
formData.append("content",selected.content);
if(selected.newImage){
formData.append("image",selected.newImage);
}
await API.put(`/notes/${selected.id}`,formData,{
headers:{ "Content-Type":"multipart/form-data" }
});
setSelected(null);
loadNotes();
};



return(

<div className="min-h-screen bg-yellow-50">

{/* HEADER */}
<div className="bg-white shadow flex justify-between items-center px-8 py-4">

<h1 className="text-2xl font-bold">
Keep Notes
</h1>

<input
placeholder="Search notes..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border rounded-full px-5 py-2 w-96 outline-none"
/>

<button
onClick={logout}
className="bg-red-400 text-white px-4 py-2 rounded-full">
Logout
</button>

</div>


{/* NOTES GRID */}
<div className="p-8 grid grid-cols-4 gap-6">

{notes.map(note=>(

<div
key={note.id}
onClick={()=>setViewNote(note)}
className="bg-white p-4 rounded-2xl shadow hover:shadow-xl cursor-pointer transition">

<h3 className="font-semibold">
{note.title}
</h3>

{note.image_url&&(
<img
src={`http://127.0.0.1:8000${note.image_url}`}
alt="note"
onError={(e)=>e.target.style.display="none"}
className="mt-3 rounded-lg max-h-40 w-full object-cover"
/>
)}

<p className="text-sm mt-2 text-gray-600">
{note.content}
</p>

<div
onClick={(e)=>e.stopPropagation()}
className="flex justify-between mt-4 text-sm">

<button
onClick={()=>setSelected({...note})}
className="text-blue-500">
Edit
</button>

<button
onClick={()=>deleteNote(note.id)}
className="text-red-500">
Delete
</button>

</div>

</div>

))}

</div>


{/* FLOAT BUTTON */}
<button
onClick={()=>setShowCreate(true)}
className="fixed bottom-10 right-10 bg-yellow-400 w-16 h-16 rounded-full text-3xl shadow-lg hover:scale-110 transition">
+
</button>


{/* CREATE NOTE */}
{showCreate&&(
<div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start pt-24">
<div className="bg-white w-[520px] p-6 rounded-2xl">

<input
placeholder="Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
className="w-full text-lg font-semibold outline-none"
/>

<label className="mt-4 inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full cursor-pointer">
📷 Add Image
<input
type="file"
accept=".jpg,.jpeg,.png"
onChange={(e)=>setImageFile(e.target.files[0])}
className="hidden"
/>
</label>

{imageFile&&(
<img
src={URL.createObjectURL(imageFile)}
className="mt-4 rounded-lg max-h-40 w-full object-cover"
/>
)}

<textarea
placeholder="Take a note..."
value={content}
onChange={(e)=>setContent(e.target.value)}
rows="5"
className="w-full mt-4 outline-none resize-none"
/>

<div className="flex justify-end gap-4 mt-6">
<button onClick={()=>setShowCreate(false)}>Cancel</button>
<button
onClick={createNote}
className="bg-yellow-400 px-5 py-2 rounded-full">
Save
</button>
</div>

</div>
</div>
)}


{/* EDIT NOTE */}
{selected&&(
<div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
<div className="bg-white w-[520px] p-6 rounded-2xl">

<input
value={selected.title}
onChange={(e)=>setSelected({...selected,title:e.target.value})}
className="w-full text-lg font-semibold outline-none"
/>

<label className="mt-4 inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full cursor-pointer">
📷 Change Image
<input
type="file"
accept=".jpg,.jpeg,.png"
onChange={(e)=>setSelected({...selected,newImage:e.target.files[0]})}
className="hidden"
/>
</label>

{selected.newImage&&(
<img
src={URL.createObjectURL(selected.newImage)}
className="mt-4 rounded-lg max-h-40 w-full object-cover"
/>
)}

<textarea
value={selected.content}
onChange={(e)=>setSelected({...selected,content:e.target.value})}
rows="5"
className="w-full mt-4 outline-none"
/>

<div className="flex justify-end gap-4 mt-6">
<button onClick={()=>setSelected(null)}>Cancel</button>
<button
onClick={updateNote}
className="bg-yellow-400 px-5 py-2 rounded-full">
Save
</button>
</div>

</div>
</div>
)}


{/* VIEW NOTE */}
{viewNote&&(
<div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
<div className="bg-white w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 relative">

<button
onClick={()=>setViewNote(null)}
className="absolute top-4 right-4 text-xl">
✖
</button>

<h2 className="text-2xl font-bold">
{viewNote.title}
</h2>

{viewNote.image_url&&(
<img
src={`http://127.0.0.1:8000${viewNote.image_url}`}
className="mt-5 rounded-xl w-full max-h-[500px] object-contain"
/>
)}

<p className="mt-5 whitespace-pre-wrap">
{viewNote.content}
</p>

</div>
</div>
)}

</div>

);
}