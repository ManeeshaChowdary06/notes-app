import React,{useState} from "react";
import axios from "./axios";
import {useNavigate,Link} from "react-router-dom";

function Login(){

const navigate=useNavigate();

const[email,setEmail]=useState("");
const[password,setPassword]=useState("");

const login=async(e)=>{
e.preventDefault();

try{

const res=await axios.post("/auth/login",{
email,
password
});

localStorage.setItem("token",res.data.access_token);

navigate("/home");

}catch(err){

alert("Invalid Credentials");

}

};

return(

<div className="h-screen flex justify-center items-center bg-gray-100">

<form
onSubmit={login}
className="bg-white p-8 rounded-xl shadow-md w-[350px]"
>

<h2 className="text-2xl font-bold mb-6 text-center">
Login
</h2>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full border p-2 rounded mb-4"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full border p-2 rounded mb-4"
/>

<button
type="submit"
className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
>
Login
</button>

{/* SIGNUP LINK */}

<p className="text-center mt-5 text-sm">

Don't have an account ?

<Link to="/"
className="text-blue-600 font-semibold ml-1 hover:underline"
>

Sign Up

</Link>

</p>

</form>

</div>

);

}

export default Login;