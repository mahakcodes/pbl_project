import { createContext, useState, useContext, useCallback } from 'react'
import { api } from '../api/client'
const AppContext = createContext()
export function AppProvider({children}) {
  const [user, setUser] = useState(null)
  const [toast, setToast] = useState(null)
  const [modal, setModal] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const showToast = useCallback((m, t='info') => { setToast({m, t}); setTimeout(()=>setToast(null), 3000) }, [])
  const login = useCallback(async (cred, role) => {
    const u = await api.auth.login(cred)
    setUser(u); showToast(`Welcome, ${u.first_name}!`, 'success'); return u
  }, [showToast])
  const logout = useCallback(() => { setUser(null); showToast('Logged out', 'info') }, [showToast])
  return (<AppContext.Provider value={{user, toast, modal, setModal, menuOpen, setMenuOpen, login, logout, showToast}}>{children}</AppContext.Provider>)
}
export const useApp = () => useContext(AppContext)