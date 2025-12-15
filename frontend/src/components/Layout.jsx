import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, Search, BarChart2, Shield, Settings, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import VoiceCommander from './VoiceCommander';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
    <Link to={path}>
        <div className={clsx(
            "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer mb-2",
            active ? "bg-cyber-primary text-cyber-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]" : "text-gray-400 hover:bg-white/5 hover:text-white"
        )}>
            <Icon size={20} />
            <span>{label}</span>
            {active && <motion.div layoutId="active-indicator" className="ml-auto w-1 h-1 bg-cyber-black rounded-full" />}
        </div>
    </Link>
);

export default function Layout({ children }) {
    const location = useLocation();

    const navItems = [
        { label: 'Dashboard', path: '/', icon: Home },
        { label: 'Ingest Data', path: '/ingest', icon: Upload },
        { label: 'Search', path: '/search', icon: Search },
        { label: 'Analytics', path: '/analytics', icon: BarChart2 },
        { label: 'Admin/Security', path: '/admin', icon: Shield },
    ];

    return (
        <div className="flex h-screen w-full bg-cyber-black text-white bg-[url('/bg-grid.png')] bg-repeat">
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col glass-panel m-4 mr-0">
                <div className="mb-8 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-cyber-primary rounded-full animate-pulse-glow" />
                    <h1 className="text-xl font-orbitron font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-cyber-secondary">
                        NEXUS <span className="text-xs text-gray-500 block font-inter">Intel Agency</span>
                    </h1>
                </div>

                <nav className="flex-1">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                        />
                    ))}
                </nav>

                <div className="mt-auto pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-white cursor-pointer transition-colors">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </div>
                </div>
            </aside>

            <main className="flex-1 p-4 overflow-y-auto">
                <div className="h-full w-full glass-panel p-6 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10 w-full h-full">
                        {children}
                    </div>
                </div>
            </main>
            <VoiceCommander />
        </div>
    );
}
