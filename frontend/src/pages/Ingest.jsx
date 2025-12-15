import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Ingest() {
    const [files, setFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState({}); // 'uploading', 'success', 'error'
    const [results, setResults] = useState({});

    const onDrop = async (acceptedFiles) => {
        setFiles([...files, ...acceptedFiles]);

        for (const file of acceptedFiles) {
            setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }));
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await axios.post('http://localhost:8000/ingest/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
                setResults(prev => ({ ...prev, [file.name]: res.data }));
            } catch (err) {
                setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
            }
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div className="p-6">
            <h2 className="text-3xl font-orbitron mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-cyber-secondary">
                Secure Data Ingestion
            </h2>

            <div
                {...getRootProps()}
                className={`h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${isDragActive ? 'border-cyber-primary bg-cyber-primary/10' : 'border-gray-600 hover:border-cyber-primary hover:bg-white/5'}`}
            >
                <input {...getInputProps()} />
                <Upload size={48} className="text-cyber-primary mb-4" />
                <p className="text-gray-400 font-code">Drag & drop classified documents here, or click to select</p>
                <p className="text-xs text-gray-600 mt-2">.txt, .csv, .json, .pdf types supported</p>
            </div>

            <div className="mt-8 space-y-4">
                <AnimatePresence>
                    {files.map(file => (
                        <motion.div
                            key={file.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="glass-panel p-4 flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-4">
                                <FileText className="text-cyber-secondary" />
                                <div>
                                    <p className="font-bold">{file.name}</p>
                                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                {uploadStatus[file.name] === 'uploading' && <span className="text-yellow-400 animate-pulse">Scanning...</span>}
                                {uploadStatus[file.name] === 'success' && (
                                    <div className="flex items-center space-x-2 text-green-400">
                                        <CheckCircle size={16} />
                                        <span className="text-xs uppercase border border-green-500/30 px-2 py-1 rounded">
                                            {results[file.name]?.classification_level || 'Classified'}
                                        </span>
                                    </div>
                                )}
                                {uploadStatus[file.name] === 'error' && <AlertTriangle className="text-red-500" />}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
