const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// replace everything from top up to navGroups = [
const goodTop = `import ditLogo from '../assets/images/regenerated_image_1783588651815.png';
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Code2,
  Users,
  LogOut,
  CalendarClock,
  Landmark,
  MessageSquare,
  Link2,
  FileSignature,
  Menu,
  ShieldAlert,
  X,
  ChevronDown,
  ArrowLeft,
  Megaphone,
  Search
} from 'lucide-react';

const navGroups = [`;

code = code.replace(/import ditLogo[\s\S]*?const navGroups = \[/, goodTop);
fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
