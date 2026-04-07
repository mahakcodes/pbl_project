import { useApp } from '../context/AppContext'
export default function Modal({title, children}) {
  const { setModal } = useApp()
  return (<div className="modal-overlay" onClick={()=>setModal(null)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-header"><h3>{title}</h3><button className="modal-close" onClick={()=>setModal(null)}>✕</button></div><div className="modal-body">{children}</div></div></div>)
}