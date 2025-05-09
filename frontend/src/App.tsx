import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './pages/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'
import Published from './pages/Published'
import Results from './pages/Results'
import Theme from './pages/Theme'
import ChatReader from './pages/ChatReader';
import GoogleOAuthSuccess from './pages/GoogleOAuthSuccess'
import Docs from './pages/docs/docs'
import PrivateRoute from './components/PrivateRoute';
import SubscriptionSuccess from './pages/SubscriptionSuccess';


// New generalistic component for /editor routes.
const EditorRouter: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const flowParam = searchParams.get('flow_id') || '';
  // Split the flowParam into uid and optional subroute.
  const [uid, subRoute] = flowParam.split('/');

  if(subRoute === 'published') {
    return <Published />;
  } else if(subRoute === 'results') {
    return <Results />;
  } else if(subRoute === 'theme') {
    return <Theme />;
  }
  // Future cases for other subroutes can be handled here.
  return <Editor />;
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/googleOauthSuccess" element={<GoogleOAuthSuccess />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
        <Route path="/docs" element={<Docs />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor" element={<EditorRouter />} />
        </Route>
        <Route path="/chat/:custom_url" element={<ChatReader />} />
      </Routes>
    </Layout>
  )
}

export default App
