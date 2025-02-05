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
import CreateEstate from './Components/CreateEstate/CreateEstate.tsx';
import {PostPage} from "./Components/PostPage/PostPage.tsx";
import "leaflet/dist/leaflet.css";
import { UserProfile } from './Components/UserProfile/UserProfile.tsx';
import SearchEstate from './Components/SearchEstate/SearchEstate.tsx';
import {EstatePage} from './Components/EstatePage/EstatePage.tsx';

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
                <Route path="/forum" element={<ForumPage/>} />
                <Route path="/forum/:postId" element={<PostPage />} />
                <Route path="/create-estate" element={<CreateEstate/>}/>
                <Route path="/user-profile/:id" element={<UserProfile/>}/>
                <Route path="/search-estates" element={<SearchEstate/>}/>
                <Route path="/estate-page/:id" element={<EstatePage />} /> 
                <Route path="/estate-details/:id" element={<EstatePage />} /> 
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
