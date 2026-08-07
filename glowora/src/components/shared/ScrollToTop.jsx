import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// ---------------------------------------------------------------------------
// ScrollToTop
// ---------------------------------------------------------------------------
// React Router does not reset scroll position on navigation by default, so
// without this, navigating to a new page keeps whatever scroll offset the
// previous page was left at. Mounted once inside <BrowserRouter> (see
// main.jsx) so it runs on every route change, across every route in the app.
// ---------------------------------------------------------------------------
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}
