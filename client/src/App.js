import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Home from "./components/Home/Home.jsx";
import SignIn from "./components/User/SignIn.jsx";
import Login from "./components/User/Login/Login";
import "./App.css";
import Footer from "./components/Footer/Footer";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import Register from "./components/User/SignUp/Register";
import Products from "./components/Products/Products";
import Cart from "./components/Cart/Cart.jsx";
import Dashboard from "./components/admin/Dashboard";
import ProductList from "./components/admin/ProductList.jsx";
import NewProduct from "./components/admin/NewProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import UserList from "./components/admin/UserList";
import OrderList from "./components/admin/OrderList";
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder.jsx";
import Profile from "./components/User/Profile";
import UpdateProfile from "./components/User/UpdateProfile";
import ProductReviews from "./components/admin/ProductReviews";
import Payment from "./components/Cart/Payment.jsx";
import Success from "./components/Cart/Success.jsx";
import MyOrders from "./components/User/MyOrders.jsx";
import MyOrderDetails from "./components/User/MyOrderDetails.jsx";

import ProcessOrder from "./components/admin/ProcessOrder";
function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
                <Footer />
              </>
            }
          />
          <Route
            path="/auth/signin"
            element={
              <>
                <SignIn />
                <Footer />
              </>
            }
          />
          <Route
            path="/product/:id"
            element={
              <>
                <ProductDetails />
                <Footer />
              </>
            }
          />
          <Route
            path="/products/"
            element={
              <>
                <Products />
                <Footer />
              </>
            }
          />
          <Route
            path="/products/:keyword"
            element={
              <>
                <Products />
                <Footer />
              </>
            }
          />
          <Route
            path="/shopping-cart"
            element={
              <>
                <Cart />
                <Footer />
              </>
            }
          />
          <Route
            path="/my/orders"
            element={
              <>
                <MyOrders />
                <Footer />
              </>
            }
          />

          <Route
            path="/my/order-details/:id"
            element={
              <>
                <MyOrderDetails />
                <Footer />
              </>
            }
          />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/product" element={<NewProduct />} />
          <Route path="/admin/product/:productId" element={<UpdateProduct />} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/order/:id" element={<ProcessOrder />} />
          <Route path="/admin/reviews" element={<ProductReviews />} />
          <Route path="/proceed/payment" element={<Payment />} />
          <Route path="/order/successful" element={<Success />} />
          <Route
            path="/shipping"
            element={
              <>
                <Shipping />
                <Footer />
              </>
            }
          />
          <Route
            path="/order/confirm"
            element={
              <>
                <ConfirmOrder />
                <Footer />
              </>
            }
          />
          <Route
            path="/user/me"
            element={
              <>
                <Profile />
                <Footer />
              </>
            }
          />
          <Route
            path="/me/update"
            element={
              <>
                <UpdateProfile />
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
