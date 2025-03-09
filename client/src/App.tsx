import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import AllReports from "@/pages/AllReports";
import ReportDetail from "@/pages/ReportDetail";
import Checkout from "@/pages/Checkout";
import Learn from "@/pages/Learn";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Admin from "@/pages/Admin";
import Account from "@/pages/Account";
import Cart from "@/pages/Cart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/reports" component={AllReports} />
          <Route path="/reports/:id" component={ReportDetail} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/learn" component={Learn} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/admin" component={Admin} />
          <Route path="/account" component={Account} />
          <Route path="/cart" component={Cart} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;
