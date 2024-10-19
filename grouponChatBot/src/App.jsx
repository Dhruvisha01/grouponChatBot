import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// importing react functions
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Router and useNavigate

// importing Pages
import { Home } from './pages/home';
import { DealsPage } from './pages/deals';
import { Sell } from './pages/sell';
import { FAQ } from './pages/FAQ';
import { TrendingCoupons } from './pages/trendingCoupons';

function App() {
  return (
    <>
      <div className='app-background'>
        <Home />
      </div>
      <Routes>
        <Route path="/deals/:category/:location" element={<DealsPage />} /> {/* Render DealsPage when navigated */}
        <Route path="/sell_on_groupon" element={<Sell />} /> {/* Render Sell Page when navigated */}
        <Route path="/FAQs" element={<FAQ />} /> {/* Render FAQs Page when navigated */}
        <Route path="/trending-coupons/:location" element={<TrendingCoupons />} /> {/* Render Trending Coupons when navigated */}
      </Routes>

    </>
  );
}

export default App;
