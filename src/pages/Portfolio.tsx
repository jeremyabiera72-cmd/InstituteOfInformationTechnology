import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.tsx';
import { 
  Users, Loader2, Edit3, X, Globe, Phone, MapPin, BadgeInfo, 
  Mail, HeartPulse, ShieldAlert, Search, Github, ExternalLink, 
  Plus, Trash2, Code, Sparkles, BookOpen, Award, CheckCircle2
} from 'lucide-react';

export default function Portfolio() {
  const { user, dbUser } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom skills state
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Projects state
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', url: '' });
  const [addingProject, setAddingProject] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    studentIdStr: '',
    facebookUrl: '',
    githubUrl: '',
    phoneNumber: '',
    address: '',
    emergencyContact: '',
    secondaryEmergencyContact: '',
    parentName: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const currentArea = localStorage.getItem('userArea') || 'BSCS';
      const [studentsRes, myPortfolioRes] = await Promise.all([
        axios.get(`/api/students?area=${currentArea}`),
        axios.get('/api/portfolio')
      ]);
      
      setStudents(studentsRes.data || []);
      
      if (myPortfolioRes.data) {
        const p = myPortfolioRes.data;
        const me = (studentsRes.data || []).find((s: any) => s.uid === user?.uid);
        
        let parsedSkills: string[] = [];
        if (p.skills) {
          try {
            parsedSkills = typeof p.skills === 'string' && p.skills.startsWith('[') 
              ? JSON.parse(p.skills) 
              : p.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
          } catch {
            parsedSkills = [];
          }
        }

        setSkillsList(parsedSkills);
        setMyProjects(p.projects || []);

        setFormData({
          fullName: me?.fullName || me?.displayName || user?.displayName || '',
          bio: p.bio || '',
          studentIdStr: p.studentIdStr || '',
          facebookUrl: p.facebookUrl || '',
          githubUrl: p.githubUrl || '',
          phoneNumber: p.phoneNumber || '',
          address: p.address || '',
          emergencyContact: p.emergencyContact || '',
          secondaryEmergencyContact: p.secondaryEmergencyContact || '',
          parentName: p.parentName || ''
        });
      } else {
        // No portfolio yet — pre-fill name from auth
        setFormData(prev => ({
          ...prev,
          fullName: dbUser?.fullName || user?.displayName || '',
        }));
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put('/api/portfolio', {
        ...formData,
        skills: skillsList
      });
      setEditing(false);
      await fetchData();
      alert('Profile saved successfully!');
    } catch (error: any) {
      console.error('Failed to update portfolio:', error);
      alert('Failed to save profile. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skillsList.includes(newSkillInput.trim())) {
      setSkillsList([...skillsList, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter(s => s !== skillToRemove));
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    setAddingProject(true);
    try {
      const res = await axios.post('/api/portfolio/projects', newProject);
      setMyProjects([...myProjects, res.data]);
      setNewProject({ title: '', description: '', url: '' });
    } catch (err) {
      console.error('Failed to add project:', err);
    } finally {
      setAddingProject(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await axios.delete(`/api/portfolio/projects/${id}`);
      setMyProjects(myProjects.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  // Filter students based on search query
  const filteredStudents = (Array.isArray(students) ? students : []).filter(student => {
    const query = searchQuery.toLowerCase();
    const name = (student.fullName || student.displayName || '').toLowerCase();
    const email = (student.email || '').toLowerCase();
    const studentId = (student.portfolio?.studentIdStr || '').toLowerCase();
    const bio = (student.portfolio?.bio || '').toLowerCase();
    
    let skillsStr = '';
    if (student.portfolio?.skills) {
      skillsStr = typeof student.portfolio.skills === 'string' ? student.portfolio.skills.toLowerCase() : '';
    }

    return name.includes(query) || email.includes(query) || studentId.includes(query) || bio.includes(query) || skillsStr.includes(query);
  });

  const selectedStudent = students.find(s => s.id === expandedId);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-slate-500">Loading directory profiles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-2 sm:px-4">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> CS Student Hub Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Student Directory & Portfolios</h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl">
              Discover classmates, explore student projects, connect, and showcase your skills to your peer community.
            </p>
          </div>
          
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl transition-all duration-200 font-semibold text-sm shadow-lg shadow-indigo-600/30 shrink-0 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Edit3 className="w-4 h-4" /> Edit My Profile & Projects
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-8 relative max-w-2xl">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search classmates by name, email, student ID, bio or skill..."
            className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 transition-all text-sm shadow-inner"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Classmates ({filteredStudents.length})
          </h2>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {localStorage.getItem('userArea') || 'BSCS'} Program
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-700">No students found</h3>
            <p className="text-sm text-slate-400">Try adjusting your search criteria or clear the search bar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => {
              let parsedSkills: string[] = [];
              if (student.portfolio?.skills) {
                try {
                  parsedSkills = typeof student.portfolio.skills === 'string' && student.portfolio.skills.startsWith('[')
                    ? JSON.parse(student.portfolio.skills)
                    : student.portfolio.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
                } catch {
                  parsedSkills = [];
                }
              }

              return (
                <div
                  key={student.id}
                  onClick={() => setExpandedId(student.id)}
                  className="group bg-white rounded-2xl shadow border border-slate-200/80 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 cursor-pointer"
                >
                  {/* Card Cover Gradient */}
                  <div className="h-28 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 relative p-4">
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white uppercase tracking-wider border border-white/20">
                      {student.area || localStorage.getItem('userArea') || 'BSCS'}
                    </div>
                    {/* Avatar */}
                    <div className="absolute -bottom-7 left-6">
                      <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-md bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                        {student.avatarUrl ? (
                          <img src={student.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-black text-indigo-600">
                            {student.fullName?.charAt(0) || student.displayName?.charAt(0) || student.email?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="pt-9 px-6 pb-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                        {student.fullName || student.displayName || student.email?.split('@')[0]}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{student.email}</span>
                      </p>
                      {student.portfolio?.bio && (
                        <p className="text-xs text-slate-600 line-clamp-2 mt-2 pt-2 border-t border-slate-100 italic">
                          "{student.portfolio.bio}"
                        </p>
                      )}
                    </div>

                    {/* Skills Tags */}
                    {parsedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {parsedSkills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[11px] font-semibold">
                            {skill}
                          </span>
                        ))}
                        {parsedSkills.length > 3 && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[11px] font-medium">
                            +{parsedSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <BadgeInfo className="w-3.5 h-3.5 text-indigo-500" />
                        {student.portfolio?.studentIdStr || 'Student'}
                      </span>
                      <span className="text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-semibold">
                        View Profile →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col border border-slate-100" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 p-6 sm:p-8 text-white relative shrink-0">
              <button 
                onClick={() => setExpandedId(null)}
                className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-20 h-20 rounded-2xl border-4 border-white/20 shadow-xl bg-white flex items-center justify-center overflow-hidden shrink-0">
                  {selectedStudent.avatarUrl ? (
                    <img src={selectedStudent.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black text-indigo-600">
                      {selectedStudent.fullName?.charAt(0) || selectedStudent.displayName?.charAt(0) || selectedStudent.email?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold leading-tight">
                    {selectedStudent.fullName || selectedStudent.displayName || selectedStudent.email?.split('@')[0]}
                  </h2>
                  <p className="text-indigo-200 text-sm mt-0.5 flex items-center gap-1.5">
                    <Mail className="w-4 h-4" /> {selectedStudent.email}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
                      {selectedStudent.area || localStorage.getItem('userArea') || 'BSCS'}
                    </span>
                    {selectedStudent.portfolio?.studentIdStr && (
                      <span className="px-3 py-0.5 bg-indigo-500/30 rounded-full text-xs font-medium border border-indigo-400/30">
                        ID: {selectedStudent.portfolio.studentIdStr}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-700">
              
              {/* Bio Section */}
              {selectedStudent.portfolio?.bio && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">About Me</h4>
                  <p className="text-slate-800 text-sm leading-relaxed">{selectedStudent.portfolio.bio}</p>
                </div>
              )}

              {/* Contact & Social Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedStudent.portfolio?.phoneNumber && (
                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase">Phone</span>
                      <span className="text-sm font-semibold text-slate-800">{selectedStudent.portfolio.phoneNumber}</span>
                    </div>
                  </div>
                )}

                {selectedStudent.portfolio?.address && (
                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase">Address / Location</span>
                      <span className="text-sm font-semibold text-slate-800">{selectedStudent.portfolio.address}</span>
                    </div>
                  </div>
                )}

                {selectedStudent.portfolio?.facebookUrl && (
                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase">Social Profile</span>
                      <a href={selectedStudent.portfolio.facebookUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                        Link <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {selectedStudent.portfolio?.githubUrl && (
                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <Github className="w-4 h-4 text-slate-800 shrink-0" />
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase">GitHub Profile</span>
                      <a href={selectedStudent.portfolio.githubUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                        GitHub <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Skills */}
              {selectedStudent.portfolio?.skills && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-indigo-600" /> Skills & Technical Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(typeof selectedStudent.portfolio.skills === 'string' && selectedStudent.portfolio.skills.startsWith('[')
                      ? JSON.parse(selectedStudent.portfolio.skills)
                      : selectedStudent.portfolio.skills.split(',')).map((s: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold">
                          {s.trim()}
                        </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded Notes */}
              {selectedStudent.notes && selectedStudent.notes.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-600" /> Uploaded Class Notes ({selectedStudent.notes.length})
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedStudent.notes.map((note: any) => (
                      <div key={note.id} className="p-3.5 bg-emerald-50/40 rounded-2xl border border-emerald-100 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-slate-800 text-xs">{note.title}</h5>
                          {note.description && <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{note.description}</p>}
                        </div>
                        {note.fileUrl && (
                          <a href={note.fileUrl} target="_blank" rel="noreferrer" className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl flex items-center gap-1 shrink-0">
                            Download <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shared Links */}
              {selectedStudent.sharedLinks && selectedStudent.sharedLinks.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-600" /> Shared Resources & Links ({selectedStudent.sharedLinks.length})
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedStudent.sharedLinks.map((link: any) => (
                      <div key={link.id} className="p-3.5 bg-blue-50/40 rounded-2xl border border-blue-100 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-slate-800 text-xs">{link.title}</h5>
                          {link.description && <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{link.description}</p>}
                        </div>
                        {link.url && (
                          <a href={link.url} target="_blank" rel="noreferrer" className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl flex items-center gap-1 shrink-0">
                            Visit Link <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Emergency Contacts */}
              {(selectedStudent.portfolio?.emergencyContact || selectedStudent.portfolio?.secondaryEmergencyContact || selectedStudent.portfolio?.parentName) && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-rose-500" /> Emergency Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {selectedStudent.portfolio?.emergencyContact && (
                      <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-rose-900">
                        <span className="font-bold block text-rose-700">Primary Emergency Contact</span>
                        {selectedStudent.portfolio.emergencyContact}
                      </div>
                    )}
                    {selectedStudent.portfolio?.secondaryEmergencyContact && (
                      <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-amber-900">
                        <span className="font-bold block text-amber-700">Secondary Emergency Contact</span>
                        {selectedStudent.portfolio.secondaryEmergencyContact}
                      </div>
                    )}
                    {selectedStudent.portfolio?.parentName && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 col-span-full">
                        <span className="font-bold block text-slate-600">Parent / Guardian Name</span>
                        {selectedStudent.portfolio.parentName}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Edit Profile & Projects Modal */}
      {editing && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl relative flex flex-col border border-slate-100">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Edit Profile & Projects</h2>
                  <p className="text-xs text-slate-500">Update your student information, skills and showcase portfolio.</p>
                </div>
              </div>
              <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/60 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleUpdate} className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">General Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Student ID String</label>
                    <input
                      type="text"
                      placeholder="e.g. 2023-10492"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                      value={formData.studentIdStr}
                      onChange={(e) => setFormData({...formData, studentIdStr: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bio / About Yourself</label>
                  <textarea
                    rows={3}
                    placeholder="Short bio about your academic focus, passions, or tech interests..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                </div>
              </div>

              {/* Skills Tags Manager */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                  <Code className="w-4 h-4" /> Skills & Technologies
                </h3>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a skill (e.g. React, Python, Java, Figma)"
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {skillsList.map((skill, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold">
                      {skill}
                      <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-rose-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {skillsList.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No skills added yet.</p>
                  )}
                </div>
              </div>

              {/* Social & Web Links */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">Contact & Social Links</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+63 900 000 0000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location / Address</label>
                    <input
                      type="text"
                      placeholder="City or Campus location"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Facebook / Social URL</label>
                    <input
                      type="text"
                      placeholder="https://facebook.com/username"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-mono"
                      value={formData.facebookUrl}
                      onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Profile URL</label>
                    <input
                      type="text"
                      placeholder="https://github.com/username"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-mono"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Projects Manager */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> My Projects & Portfolio Items
                </h3>

                {/* Existing Projects List */}
                <div className="space-y-2">
                  {myProjects.map((proj) => (
                    <div key={proj.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{proj.title}</span>
                        {proj.description && <p className="text-slate-500 text-[11px] truncate max-w-sm">{proj.description}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* New Project Input */}
                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-indigo-900 block">Add New Project</span>
                  <input
                    type="text"
                    placeholder="Project Title"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Short Description"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Project URL (optional)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                    value={newProject.url}
                    onChange={(e) => setNewProject({...newProject, url: e.target.value})}
                  />
                  <button
                    type="button"
                    disabled={!newProject.title.trim() || addingProject}
                    onClick={handleAddProject}
                    className="w-full py-2 bg-indigo-600 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    {addingProject ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    Add Project
                  </button>
                </div>
              </div>

              {/* Emergency Information */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4" /> Emergency Contact Setup
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Primary Emergency Contact</label>
                    <input
                      type="text"
                      placeholder="Phone or Mobile No."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-colors"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Secondary Emergency Contact</label>
                    <input
                      type="text"
                      placeholder="Phone or Mobile No."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-colors"
                      value={formData.secondaryEmergencyContact}
                      onChange={(e) => setFormData({...formData, secondaryEmergencyContact: e.target.value})}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Name</label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                      value={formData.parentName}
                      onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Save Profile Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
