import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
export default function Sidebar() {
  const { user, logout, menuOpen, setMenuOpen } = useApp()
  const navigate = useNavigate()
  const isStudent = user?.role === 'student'
  const navItems = isStudent ? [{id:'/student/dashboard',icon:'📊',t:'Dashboard'},{id:'/student/tests',icon:'📝',t:'My Tests'}] : [{id:'/teacher/dashboard',icon:'📊',t:'Dashboard'},{id:'/teacher/tests',icon:'📋',t:'Created Tests'},{id:'/teacher/students',icon:'👥',t:'Student List'},{id:'/teacher/create',icon:'➕',t:'Create Test'}]
  return (<>
    <div className={`sidebar-overlay ${menuOpen?'open':''}`} onClick={()=>setMenuOpen(false)} />
    <aside className={`sidebar ${menuOpen?'open':''}`}>
      <div className="sidebar-header"><div className={`sidebar-logo ${isStudent?'student-logo':'teacher-logo'}`}>📝</div><div><div className="sidebar-title">DTEP</div><div className="sidebar-subtitle">Test Portal v1.0</div></div></div>
      <nav className="sidebar-nav"><div className="sidebar-nav-label">Main</div>
        {navItems.map(i=><div key={i.id} className={`sidebar-nav-item ${window.location.pathname===i.id?'active':''}`} onClick={()=>{navigate(i.id);setMenuOpen(false)}}><span className="nav-icon">{i.icon}</span>{i.t}</div>)}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className={`sidebar-user-avatar ${isStudent?'student-avatar':'teacher-avatar'}`}>{user?.first_name?.[0]}1</div>
          <div className="sidebar-user-info"><div className="sidebar-user-name">{user?.first_name} {user?.last_name}</div><div className="sidebar-user-role">{isStudent?'Student':'Teacher'}</div></div>
          <button className="logout-btn" onClick={()=>{logout();navigate('/')}}>⏻</button>
        </div>
      </div>
    </aside>
  </>)
}