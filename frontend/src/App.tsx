import './App.css'
import {UserProvider} from "./Context/useAuth.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import {Toaster} from "react-hot-toast";
import {Home} from "./Components/Home/Home.tsx";
import {LoginPage} from "./Components/LoginPage/LoginPage.tsx";
import {RegisterPage} from "./Components/RegisterPage/RegisterPage.tsx";
import {Navbar} from "./Components/Navbar/Navbar.tsx";
import {Footer} from "./Components/Footer/Footer.tsx";
import {ForumPage} from "./Components/ForumPage/ForumPage.tsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <div className="App">
            <Navbar/>
            <div className="content">
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/forum" element={<ForumPage/>}/>
              </Routes>
            </div>
            <Footer/>
            <Toaster position='top-center' reverseOrder={false}/>
          </div>
        </UserProvider>
      </BrowserRouter>
    </>
  )
}

export default App
