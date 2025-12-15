import { useState } from 'react';
import { Search as SearchIcon, Database, Globe, Lock, Unlock, FileText } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearching(true);
        try {
            const res = await axios.get(`http://localhost:8000/search?q=${query}`);
            setResults(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <h2 className="text-3xl font-orbitron mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-cyber-secondary">
                Global Intelligence Search
            </h2>

            <form onSubmit={handleSearch} className="relative mb-8 max-w-2xl">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter keywords, entities, or classification levels..."
                    className="cyber-input pl-12 h-14 text-lg rounded-full shadow-[0_0_15px_rgba(112,0,255,0.3)] focus:shadow-[0_0_25px_rgba(0,240,255,0.5)] bg-opacity-50"
                />
                <SearchIcon className="absolute left-4 top-4 text-cyber-primary" size={24} />
                <button type="submit" className="absolute right-2 top-2 cyber-button rounded-full px-6">
                    {searching ? 'Scanning...' : 'Search'}
                </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                <AnimatePresence>
                    {results.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel p-4 border-l-4 border-l-cyber-primary hover:bg-white/5 transition-colors cursor-pointer group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-2 mb-2">
                                    {item.source.includes('Local') ? <Database size={16} className="text-cyber-primary" /> : <Globe size={16} className="text-pink-500" />}
                                    <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">{item.source}</span>
                                    <span className="text-xs text-gray-600">| Accuracy: {(item.score * 100).toFixed(0)}%</span>
                                </div>
                                {item.classification === 'Top Secret' ? <Lock size={16} className="text-red-500" /> : <Unlock size={16} className="text-green-500" />}
                            </div>

                            <h3 className="text-lg font-bold text-white group-hover:text-cyber-primary transition-colors">{item.filename}</h3>
                            <p className="text-xs px-2 py-0.5 rounded bg-white/10 w-fit mt-1 mb-2 text-cyber-secondary border border-cyber-secondary/30">
                                {item.classification}
                            </p>

                            <p className="text-sm text-gray-400 font-code border-l-2 border-gray-700 pl-3">
                                {item.snippet}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {results.length === 0 && !searching && query && (
                    <div className="text-center text-gray-500 mt-12">
                        <p>No intelligence found for sector "{query}".</p>
                    </div>
                )}
            </div>
        </div>
    );
}
