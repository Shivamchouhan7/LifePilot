import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { NotFoundPage } from '../pages/NotFoundPage';

import { OverviewPage } from '../pages/OverviewPage';
import { TasksPage } from '../pages/TasksPage';
import { ApplicationsPage } from '../pages/ApplicationsPage';
import { ApplicationDetailPage } from '../pages/ApplicationDetailPage';
const CalendarPage = React.lazy(() =>
  import('../pages/CalendarPage').then(({ CalendarPage: page }) => ({ default: page }))
);
import { LearningPage } from '../pages/LearningPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ProjectDetailPage } from '../pages/ProjectDetailPage';
const NotesPage = React.lazy(() =>
  import('../pages/NotesPage').then(({ NotesPage: page }) => ({ default: page }))
);
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { SettingsPage } from '../pages/SettingsPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Authenticated Workspace Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/applications/:id" element={<ApplicationDetailPage />} />
          <Route
            path="/calendar"
            element={
              <Suspense fallback={<p className="p-6 text-sm text-muted-foreground">Loading calendar…</p>}>
                <CalendarPage />
              </Suspense>
            }
          />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route
            path="/notes"
            element={
              <Suspense fallback={<p className="p-6 text-sm text-muted-foreground">Loading notes…</p>}>
                <NotesPage />
              </Suspense>
            }
          />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
