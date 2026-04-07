import { useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
export default function TopBar() {
  const location = useLocation()
  const { setMenuOpen } = useApp()
  const titles = {'/student/dashboard':{t:'Dashboard',s:'Welcome back!'},'/student/tests':{t:'My Tests',s:'View all assigned tests'},'/teacher/dashboard':{t:'Dashboard',s:'Manage your tests'},'/teacher/tests':{t:'Created Tests',s:'All created tests'},'/teacher/students':{t:'Student List',s:'View enrolled students'},'/teacher/create':{t:'Create Test',s:'New test assignment'}}
  const c = titles[location.pathname] || {t:'Dashboard',s:''}
  return (<div className="top-bar"><div style={{display:'flex',alignItems:'center',gap:'12px'}}><button className="mobile-menu-btn" onClick={()=>setMenuOpen(true)}>☰</button><div><h2>{c.t}</h2>{c.s&&<p>{c.s}</p>}</div></div><div className="top-bar-right"><button className="top-bar-btn">🔔<span className="notification-dot"></span></button><button className="top-bar-btn">⚙</button></div></div>)
}