import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Link as LinkIcon, Activity, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Admin() {
    const [logs, setLogs] = useState([]);
    const [lineage, setLineage] = useState({ nodes: [], links: [] });
    const [integrity, setIntegrity] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const resLogs = await axios.get('http://localhost:8000/admin/audit-logs');
        setLogs(resLogs.data);
        const resLineage = await axios.get('http://localhost:8000/admin/lineage');
        setLineage(resLineage.data);
    };

    const verifyBlockchain = async () => {
        const res = await axios.post('http://localhost:8000/admin/verify-integrity');
        setIntegrity(res.data.status);
    };

    return (
        <div className="p-6 h-full overflow-y-auto">
            <h2 className="text-3xl font-orbitron mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-cyber-secondary">
                Security Command Center
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Blockchain Audit Log */}
                <div className="glass-panel p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-2">
                            <Shield className="text-cyber-primary" />
                            <h3 className="text-xl font-bold">Immutable Audit Ledger</h3>
                        </div>
                        <button onClick={verifyBlockchain} className="cyber-button text-sm py-1 px-3">
                            Verify Chain
                        </button>
                    </div>

                    {integrity && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-2 bg-green-500/20 border border-green-500 text-green-400 rounded text-center font-bold">
                            {integrity}
                        </motion.div>
                    )}

                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {logs.map((log) => (
                            <div key={log.hash} className="p-3 bg-white/5 rounded border border-cyber-glass-border">
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span className="font-mono">Block #{log.index}</span>
                                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <p className="font-bold text-sm mb-2">{log.details}</p>
                                <div className="text-[10px] font-mono text-gray-600 break-all">
                                    Hash: <span className="text-cyber-secondary">{log.hash}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Data Lineage Graph */}
                <div className="glass-panel p-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <Activity className="text-pink-500" />
                        <h3 className="text-xl font-bold">Data Lineage Tracker</h3>
                    </div>

                    <div className="relative h-96 flex items-center justify-center">
                        {/* Simple Visualization */}
                        <div className="flex flex-col items-center space-y-8 w-full max-w-sm">
                            {lineage.nodes.map((node, i) => (
                                <motion.div
                                    key={node.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="w-full relative"
                                >
                                    <div className="bg-cyber-dark border border-cyber-primary p-3 rounded-lg text-center shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                                        <p className="font-bold text-cyber-primary">{node.label}</p>
                                        <p className="text-xs text-gray-500 uppercase">{node.type}</p>
                                    </div>
                                    {i < lineage.nodes.length - 1 && (
                                        <div className="absolute left-1/2 -bottom-8 w-0.5 h-8 bg-cyber-secondary -translate-x-1/2" />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
