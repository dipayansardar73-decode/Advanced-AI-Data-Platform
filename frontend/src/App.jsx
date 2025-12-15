import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Ingest from './pages/Ingest';
import SearchPage from './pages/SearchPage';
import Analytics from './pages/Analytics';

// Placeholder Pages
const Dashboard = () => <h2 className="text-3xl font-orbitron mb-6">Mission Command Dashboard</h2>;
const Admin = () => <h2 className="text-3xl font-orbitron mb-6">Security & Audit Logs</h2>;

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ingest" element={<Ingest />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
