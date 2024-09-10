import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import userAuthStore from "./store/userAuthStore/userAuthStore";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/authentication/Login/Login";
import SignUp from "./pages/authentication/SignUp/SignUp";
import {
  CommonRoute,
  CompanyRoute,
  JobSeekerRoute,
} from "./routes/RouteCategories";

import Layout from "./layout/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import AllInterviewsCandidate from "./pages/AllInterviewsCandidate/AllInterviewsCandidate";
import AllInterviewsCompany from "./pages/AllInterviewsCompany/AllInterviewsCompany";
import TestRoom from "./pages/screens/TestRoom";

function App() {
  const user = userAuthStore((state) => state.user);
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />

              {/* Company Routes */}

              <Route
                path="/company/all-interviews"
                element={
                  <CompanyRoute user={user}>
                    <AllInterviewsCompany />
                  </CompanyRoute>
                }
              />

              {/* Candidate Routes */}

              <Route
                path="/candidate/all-interviews"
                element={
                  <JobSeekerRoute user={user}>
                    <AllInterviewsCandidate />
                  </JobSeekerRoute>
                }
              />

              {/* Common Routes */}
              <Route
                path="/room/interview/:id"
                element={
                  <CommonRoute user={user}>
                    {/* <InterviewRoom /> */}
                    <TestRoom />
                  </CommonRoute>
                }
              />
            </Routes>
          </Layout>

          <ToastContainer />
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
