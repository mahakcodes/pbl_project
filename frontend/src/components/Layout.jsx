import { Outlet, Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import Toast from './Toast'
import Modal from './Modal'
export default function Layout() {
  const { user, modal, setModal, menuOpen, setMenuOpen } = useApp()
  if (!user) return <Navigate to="/" replace />
  return (<div className="dashboard-layout"><Sidebar /><div className="main-content"><TopBar /><div className="page-content"><Outlet /></div></div><Toast />{modal && <Modal title="Test Details">{modal}</Modal>}</div>)
}