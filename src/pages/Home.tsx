import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import HomePage from '../components/HomePage'
import Dashboard from './Dashboard'

const Home = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.login)
  const userRole = user?.role || localStorage.getItem('userRole')

  if (!isAuthenticated) {
    return <HomePage />
  }

  if (userRole === 'admin') {
    return <Dashboard />
  }

  if (userRole === 'RH') {
    return <Navigate to="/workers" replace />
  }

  if (userRole === 'financier') {
    return <Navigate to="/invoices" replace />
  }

  if (userRole === 'stock_manager') {
    return <Navigate to="/list-products" replace />
  }

  if (userRole === 'park_manager') {
    return <Navigate to="/liste-vehicules" replace />
  }

  return <Dashboard />
}

export default Home