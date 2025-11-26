import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { RoleSelection } from './components/RoleSelection';
import { AIDepartmentSuggestion } from './components/AIDepartmentSuggestion';
import { AppointmentBooking } from './components/AppointmentBooking';
import { CheckIn } from './components/CheckIn';
import TasksOverview from './components/TasksOverview';
import TestChecklist from './components/TestChecklist';
import { ResultsPortal } from './components/ResultsPortal';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { FeedbackRating } from './components/FeedbackRating';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminDashboard } from './components/AdminDashboard';
import LabPanel from './components/LabPanel';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem('role') || '';
    // If user is a doctor and not already on /admin path, redirect to /admin
    if (role === 'doctor' && !location.pathname.startsWith('/admin')) {
      navigate('/admin');
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/ai-suggestion" element={<AIDepartmentSuggestion />} />
      <Route path="/book-appointment" element={<AppointmentBooking />} />
      <Route path="/check-in" element={<CheckIn />} />
      <Route path="/tasks" element={<TasksOverview />} />
      <Route path="/tasks/:patientId" element={<TestChecklist />} />
      <Route path="/results" element={<ResultsPortal />} />
      <Route path="/feedback" element={<FeedbackRating />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lab-panel"
        element={
          <ProtectedRoute>
            <LabPanel />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}