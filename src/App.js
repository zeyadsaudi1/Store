import { Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './2.pages/main';
import Header from './1.components/header';
import SearchBar from './1.components/searchBar';
import { useContext, useEffect } from 'react';
import { Auth } from './context/context';
import NavBar from './1.components/navBar';
import Footer from './1.components/footer';
import LoginBar from './1.components/loginBar';
import Error from './2.pages/error';
import SignUp from './2.pages/signup';
import TermsAndConditions from './1.components/Terms_and_Conditions';
import Admin from './2.pages/admin';
import DetailsCard from './2.pages/details';
import Product from './6.components2/products';  // تأكد من استيراد Product هنا
import PrivateRoute from './1.components/private/privateRoute';
import Dashboard from './6.components2/dashboard';
import GetUsers from './6.components2/users';
import Ads from './6.components2/ads';
import Cart from './2.pages/cart';
import CookieConsent from "react-cookie-consent";
import LoadingPage from './1.components/loadingPage';
import Order from './6.components2/orders';
import Role from './2.pages/sub_pages/role';
import Vertical from './2.pages/sub_pages/Vertical';
import Iron from './2.pages/sub_pages/iron';
import Wooden from './2.pages/sub_pages/wooden';
import Zebra from './2.pages/sub_pages/zebra';
import Hospital from './2.pages/sub_pages/hospital';
import SkyLight from './2.pages/sub_pages/skyLight';
import Reports from './6.components2/reports';
import Collaborative from './6.components2/collaborative';


function App() {
  const theme = localStorage.getItem('theme');
  const { searchBar, navBar, setMode, loignBar, showTermsAndConditions, loadingMain } = useContext(Auth);

  useEffect(() => {
    setMode(theme);
  }, [theme, setMode]);

  const hideHeaderFooter = ['/admin' ,'/admin/', '/admin/products', '/admin/users', '/admin/advertisements', "/admin/order","/admin/reports", "/admin/collaborative"];

  return (
  
  <>
  {loadingMain ? 
    <div className="App">
      {showTermsAndConditions ? <TermsAndConditions /> : null}
      {searchBar ? <SearchBar /> : null}
      {loignBar ? <LoginBar /> : null}
      {navBar ? <NavBar /> : null}
      {!hideHeaderFooter.includes(window.location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/display/:id" element={<DetailsCard />} />

        <Route path="/admin/*" element={<PrivateRoute Component={Admin} />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Product />} />
          <Route path="users" element={<GetUsers />} />
          <Route path="advertisements" element={<Ads />} />
          <Route path="order" element={<Order />} />
          <Route path="reports" element={<Reports />} />
          <Route path="collaborative" element={<Collaborative />} />
        </Route>
        
        <Route path="*" element={<Error />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/roleCurtains" element={<Role />} />
        <Route path="/verCurtains" element={<Vertical />} />
        <Route path="/ironCurtains" element={<Iron />} />
        <Route path="/woodenCurtains" element={<Wooden />} />
        <Route path="/zebraCurtains" element={<Zebra />} />
        <Route path="/hospitalCurtains" element={<Hospital />} />
        <Route path="/skylightCurtains" element={<SkyLight />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cart/*" element={<Cart />} /> {/* هنا يمكنك إضافة صفحة توجيه أخرى */}
      </Routes>
      {!hideHeaderFooter.includes(window.location.pathname) && <Footer />}
      <div>
      <CookieConsent
        location="bottom"
        buttonText="موافق"
        cookieName="userConsent"
        expires={365}
      >
        نحن نستخدم الـ cookies لتحسين تجربتك. إذا استمريت في استخدام الموقع، فإنك توافق على استخدامنا للـ cookies.
      </CookieConsent>
    </div>
    </div>
   :
   <LoadingPage/>
    }
  </>
  );
}

export default App;
