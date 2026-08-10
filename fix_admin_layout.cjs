const fs = require('fs');
let code = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

const goodTop = `import ditLogo from '../assets/images/regenerated_image_1783588651815.png';
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import {
  BookOpen, MessageSquare, Link2, Code2,
  LayoutDashboard,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  Users,
  CalendarClock,
  Landmark,
  FileSignature,
  KeyRound,
  ArrowLeft,
  ShieldAlert,
  Megaphone,
  Search
} from 'lucide-react';

const navGroups = [`;

code = code.replace(/import ditLogo[\s\S]*?const navGroups = \[/, goodTop);
fs.writeFileSync('src/layouts/AdminLayout.tsx', code);
