import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Download, AlertCircle, Activity } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Analytics() {
    const [anomalyData, setAnomalyData] = useState([]);
    const [forecastData, setForecastData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const resAnom = await axios.get('http://localhost:8000/analytics/anomalies');
        setAnomalyData(resAnom.data);

        const resFore = await axios.get('http://localhost:8000/analytics/forecast');
        setForecastData(resFore.data);
    };

    const downloadReport = async () => {
        window.open('http://localhost:8000/analytics/report', '_blank');
    };

    return (
        <div className="p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-cyber-secondary">
                    Predictive Analytics
                </h2>
                <button onClick={downloadReport} className="cyber-button flex items-center space-x-2">
                    <Download size={18} />
                    <span>Generate Briefing PDF</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Anomaly Detection Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 h-96"
                >
                    <div className="flex items-center space-x-2 mb-4">
                        <AlertCircle className="text-red-500" />
                        <h3 className="text-xl font-bold">Network Traffic Anomalies</h3>
                    </div>
                    <ResponsiveContainer width="100%" height="80%">
                        <LineChart data={anomalyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="time" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#333' }} />
                            <Line type="monotone" dataKey="value" stroke="#00f0ff" strokeWidth={2} dot={false} />
                            {anomalyData.map((entry, index) => (
                                entry.is_anomaly ? <ReferenceArea key={index} x1={entry.time - 1} x2={entry.time + 1} strokeOpacity={0.3} fill="red" fillOpacity={0.1} /> : null
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Predictive Forecast Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="glass-panel p-6 h-96"
                >
                    <div className="flex items-center space-x-2 mb-4">
                        <Activity className="text-green-500" />
                        <h3 className="text-xl font-bold">Ingestion Volume Forecast (Next 10 Days)</h3>
                    </div>
                    <ResponsiveContainer width="100%" height="80%">
                        <LineChart data={forecastData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="day" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#333' }} />
                            <Line type="monotone" dataKey="value" stroke="#7000ff" strokeWidth={3} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
}
