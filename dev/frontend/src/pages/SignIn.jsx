import { BottomWarning } from "../components/BottomWarning"
import { LongButton } from "../components/LongButton"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { LandingBar } from "../components/LandingBar"
import { API_ENDPOINTS } from "../apiConfig"
import { Modal } from '../components/Modal';
import { Loader } from '../components/Loader';

export const SignIn = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    if (!username || !password) {
      setModalMessage('All fields are required.');
      setIsSuccess(false);
      setIsModalOpen(true);
      return;
  }
    setIsLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.login, {
        username,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      setModalMessage("Logged in successfully!");
      setIsSuccess(true);
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("Invalid username or password. Please try again.");
      setIsSuccess(false);
      setIsModalOpen(true);
  } finally {
    setIsLoading(false); 
}
};

const closeModal = () => {
  setIsModalOpen(false);
  if (isSuccess) {
      navigate("/home");
  }
};
    
    return <div>
            <LandingBar/>
            <div className="bg-slate-200 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
            <form className="rounded-lg bg-white w-80 text-center p-2 h-max px-4" onSubmit={handleSubmit}>
                <Heading label={"Sign in"} />
                <SubHeading label={"Enter your credentials to access your account"} />
                <InputBox onChange = {(e)=>{setUsername(e.target.value)}} placeholder="johndoe@gmail.com" label={"Email"} autocomplete="email" />
                <InputBox type="password" onChange={(e)=>{setPassword(e.target.value)}} placeholder="john@12345" label={"Password"} autocomplete="password" />
                <div className="pt-4">
                  <LongButton label={"Sign in"} />
                </div>
                <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
            </form>
            </div>
        </div>
        {isLoading && <Loader />}
        {isModalOpen && (
                <Modal onClose={closeModal}>
                    <h3 className="text-lg font-bold mb-4">{isSuccess ? 'Success' : 'Error'}</h3>
                    <p>{modalMessage}</p>
                </Modal>
            )}
    </div>
}