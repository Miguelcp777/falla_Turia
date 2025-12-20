import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { LanguageProvider } from '@/context/LanguageContext'
import Navbar from '@/components/layout/Navbar'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import News from '@/pages/News'
import Agenda from '@/pages/Agenda'
import Lottery from '@/pages/Lottery'
import Suggestions from '@/pages/Suggestions'
import Dashboard from '@/pages/Dashboard'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import FireBackground from '@/components/layout/FireBackground'

function App() {
    return (
        <AuthProvider>
            <LanguageProvider>
                <BrowserRouter>
                    <div className="min-h-screen font-display relative overflow-hidden">
                        <FireBackground />

                        {/* Decorative Background Image - Global */}
                        <div className="absolute top-0 left-0 h-full w-1/2 z-0 pointer-events-none overflow-hidden hidden md:block">
                            <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-full h-[120%] -rotate-6 opacity-40 mix-blend-screen">
                                <img
                                    src="/bat_falla.jpg"
                                    alt="Falla Turia Art"
                                    className="w-full h-full object-cover"
                                    style={{ maskImage: 'linear-gradient(to right, black 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 100%)' }}
                                />
                            </div>
                        </div>

                        <Navbar />
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/news" element={<News />} />
                            <Route path="/agenda" element={<Agenda />} />
                            <Route path="/lottery" element={<Lottery />} />

                            {/* Member Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['standard', 'admin']} />}>
                                <Route path="/suggestions" element={<Suggestions />} />
                            </Route>

                            {/* Admin Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                                <Route path="/admin" element={<Dashboard />} />
                            </Route>
                        </Routes>
                    </div>
                </BrowserRouter>
            </LanguageProvider>
        </AuthProvider>
    )
}

export default App
