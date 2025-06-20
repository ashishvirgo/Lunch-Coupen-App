

import {BrowserRouter,Routes,Route} from 'react-router-dom'
import GenerateCoupon from './Pages/GenerateCoupon'
import VerifyCoupon from './Pages/VerifyCoupon'
import MessDashboard from './Pages/MessDashboard';
import DashBoard from './Pages/DashBoard';
const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashBoard />}></Route>
        <Route path="/dashboard" element={<MessDashboard />} />
        <Route path="/hdashboard" element={<DashBoard />} />
        <Route path="/verify" element={<VerifyCoupon/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
