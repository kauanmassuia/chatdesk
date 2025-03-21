import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const goToLogin = () => {
    navigate('/login')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to right, #6a11cb, #2575fc)',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginBottom: '20px', color: '#333' }}>
          Welcome to Chat Desk Project
        </h1>
        <button
          onClick={goToLogin}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#2575fc',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </div>
    </div>
  )
}
