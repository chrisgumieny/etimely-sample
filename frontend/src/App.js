import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom'
import Home from './Pages/homePage';
import BusinessSignup from './Pages/Auth/businessSignup';
import StaffSignup from './Pages/Auth/staffSignup';
import ResetPassword from './Pages/Auth/resetPassword';
import ChangePassword from './Pages/Auth/changePassword';
import BusinessDashboard from './Pages/BusinessUI/businessDashboardPage';
import StaffdashboardPage from './Pages/StaffUI/staffDashboardPage';
import Login from './Pages/Auth/userLogin';
import TermsAndConditions from './Pages/termsAndConditions';
import AboutUs from './Pages/aboutUs';
import EnterAvailability from './Pages/StaffUI/enterAvailability';
import CreateAnnouncement from './Pages/BusinessUI/createAnnouncement';
import ViewAnnouncements from './Pages/BusinessUI/viewAnnouncement';
import StaffAnnouncements from './Pages/StaffUI/staffAnnouncements';
import TeamSchedule from './Pages/StaffUI/teamSchedule';
import ActivateEmail from './Pages/Auth/ActivateEmail';
import TeamManagement from './Pages/BusinessUI/teamManagement';
import ScheduleCreation from './Pages/BusinessUI/scheduleCreation';
import StaffSchedulePage from './Pages/StaffUI/staffSchedulePage';
import BusinessProfilePage from './Pages/BusinessUI/businessProfilePage';
import StaffProfilePage from './Pages/StaffUI/staffProfilePage';
import TeamAvailability from './Pages/BusinessUI/teamAvailability';
import RoleCreation from './Pages/BusinessUI/roleCreation';
import ContactUsPage from './Pages/contactUsPage';
import BusinessMessageBoard from './Pages/BusinessUI/businessMessageBoard';
import StaffMessageBoard from './Pages/StaffUI/staffMessageBoard';
import NotFound from './Pages/ErrorPages/404';


function App() {
  return (
    // Create a router to navigate between pages in the application
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Business/Signup" element={<BusinessSignup />} />
        <Route path="/Staff/Signup/:token" element={<StaffSignup />} />
        <Route path="/Business/Dashboard" element={<BusinessDashboard />} />
        <Route path="/Staff/Dashboard" element={<StaffdashboardPage />} />
        <Route path="/userLogin" element={<Login />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/changePassword/:token" element={<ChangePassword />} />
        <Route path="/termsAndConditions" element={<TermsAndConditions />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/enterAvailability" element={<EnterAvailability />} />
        <Route path="/verify/:token" element={<ActivateEmail />} />
        <Route path="/Business/TeamManagement" element={<TeamManagement />} />
        <Route path="/Business/Schedule" element={<ScheduleCreation />} />
        <Route path="/Staff/Schedule" element={<StaffSchedulePage />} />
        <Route path="/Business/Profile" element={<BusinessProfilePage />} />
        <Route path="/Staff/Profile" element={<StaffProfilePage />} />
        <Route path="/Business/createAnnouncement" element={<CreateAnnouncement />} />
        <Route path="/Business/viewAnnouncement" element={<ViewAnnouncements />} />
        <Route path="/Staff/staffAnnouncements" element={<StaffAnnouncements />} />
        <Route path="/Business/TeamAvailability" element={<TeamAvailability />} />
        <Route path="/Business/RoleCreation" element={<RoleCreation />} />
        <Route path="/contactUs" element={<ContactUsPage />} />
        <Route path="/Business/messageBoard" element={<BusinessMessageBoard />} />
        <Route path="/Staff/messageBoard" element={<StaffMessageBoard />} />
        <Route path="/Staff/teamSchedule" element={<TeamSchedule />} />
        {/* If the page url doesn't exist display 404 Not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>

  );
}
export default App;