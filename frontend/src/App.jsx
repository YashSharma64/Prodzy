import { Route, Routes } from 'react-router-dom'

import Input from './pages/Input.jsx'
import Result from './pages/Result.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Input />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  )
}
