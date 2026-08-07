import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout.jsx'
import AdminLayout from './components/layout/AdminLayout.jsx'
import ProtectedRoute from './components/shared/ProtectedRoute.jsx'
import LoadingScreen from './components/shared/LoadingScreen.jsx'
import { Toaster } from 'react-hot-toast'

// ---------------------------------------------------------------------------
// Every page is lazy-loaded so the initial bundle only contains the app
// shell (layout, router, contexts) — each page's code downloads on first
// visit to that route instead of all at once. This is purely a build/
// performance optimisation: routes, paths and behaviour are unchanged.
// ---------------------------------------------------------------------------
const Landing = lazy(() => import('./pages/Landing.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'))
const VerifyOTP = lazy(() => import("./pages/VerifyOTP.jsx"))
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"))
const UserDashboard = lazy(() => import('./pages/Dashboard.jsx'))
const ProductListing = lazy(() => import('./pages/ProductListing.jsx'))
const ProductDetails = lazy(() => import('./pages/ProductDetails.jsx'))
const Brands = lazy(() => import('./pages/Brands.jsx'))
const BrandProfile = lazy(() => import('./pages/BrandProfile.jsx'))
const Categories = lazy(() => import('./pages/Categories.jsx'))
const Salons = lazy(() => import('./pages/Salons.jsx'))
const SalonProfile = lazy(() => import('./pages/SalonProfile.jsx'))
const Spas = lazy(() => import('./pages/Spas.jsx'))
const SpaProfile = lazy(() => import('./pages/SpaProfile.jsx'))
const Services = lazy(() => import('./pages/Services.jsx'))
const BookAppointment = lazy(() => import('./pages/BookAppointment.jsx'))
const BookingSuccess = lazy(() => import('./pages/BookingSuccess.jsx'))
const Appointments = lazy(() => import('./pages/Appointments.jsx'))
const SearchPage = lazy(() => import('./pages/Search.jsx'))
const Cart = lazy(() => import('./pages/Cart.jsx'))
const Checkout = lazy(() => import('./pages/Checkout.jsx'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess.jsx'))
const Wishlist = lazy(() => import('./pages/Wishlist.jsx'))
const Orders = lazy(() => import('./pages/Orders.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Membership = lazy(() => import('./pages/Membership.jsx'))
const Offers = lazy(() => import('./pages/Offers.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const FAQs = lazy(() => import('./pages/FAQs.jsx'))
const Notifications = lazy(() => import('./pages/Notifications.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts.jsx'))
const AddProduct = lazy(() => import('./pages/admin/AddProduct.jsx'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders.jsx'))
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers.jsx'))
const AdminBrands = lazy(() => import('./pages/admin/AdminBrands.jsx'))
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories.jsx'))
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory.jsx'))
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons.jsx'))
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews.jsx'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings.jsx'))
const EditProduct = lazy(() => import("./pages/admin/EditProduct.jsx"));
const AdminAppointments = lazy(() => import('./pages/admin/AdminAppointments.jsx'));

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Toaster position="top-right" toastOptions={{ className: 'font-sans text-sm shadow-xl', duration: 4000 }} />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/shop" element={<ProductListing />} />
          <Route path="/category/:categoryId" element={<ProductListing />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/brands/:id" element={<BrandProfile />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/salons" element={<Salons />} />
          <Route path="/salons/:id" element={<SalonProfile />} />
          <Route path="/spas" element={<Spas />} />
          <Route path="/spas/:id" element={<SpaProfile />} />
          <Route path="/services" element={<Services />} />
          <Route path="/book/:id" element={<BookAppointment />} />
          <Route path="/booking/success" element={<BookingSuccess />} />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<OrderSuccess />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/membership" element={<Membership />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
