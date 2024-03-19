import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import {SignIn} from "./pages/SignIn";
import {SignUp} from "./pages/SignUp";
import {HomePage} from "./pages/HomePage";
import {Profile} from "./pages/Profile";
import {Home} from "./pages/Home.jsx";

function App() {

  return (
    <>
     <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/home" element={<HomePage/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/homepage" element = {<Home/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
