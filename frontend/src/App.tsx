import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import ChatReader from './pages/ChatReader';
import GoogleOAuthSuccess from './pages/GoogleOAuthSuccess';
import PrivateRoute from './components/PrivateRoute';
import Docs from './pages/docs/Docs'; // Importando a nova página

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/googleOauthSuccess" element={<GoogleOAuthSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/docs" element={<Docs />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/chat" element={<ChatReader />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;
