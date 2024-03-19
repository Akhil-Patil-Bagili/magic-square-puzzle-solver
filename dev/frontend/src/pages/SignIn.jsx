import { BottomWarning } from "../components/BottomWarning"
import { LongButton } from "../components/LongButton"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { LandingBar } from "../components/LandingBar"

export const SignIn = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
      const response = await axios.post("http://127.0.0.1:5000/signin",{
        username,
        password
      })
      localStorage.setItem("token", response.data.access_token)
      navigate("/homepage")
    }
    
    return <div>
            <LandingBar/>
            <div className="bg-slate-200 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign in"} />
                <SubHeading label={"Enter your credentials to access your account"} />
                <InputBox onChange = {(e)=>{
                setUsername(e.target.value);
                }} placeholder="johndoe@gmail.com" label={"Email"} />
                <InputBox onChange={(e)=>{
                setPassword(e.target.value);
                }} placeholder="john@12345" label={"Password"} />
                <div className="pt-4">
                <LongButton onClick = {handleSubmit} label={"Sign in"} />
                </div>
                <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
            </div>
            </div>
        </div>
    </div>
}