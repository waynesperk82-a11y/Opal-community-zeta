import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Ask from "./pages/Ask";
import Feed from "./pages/Feed";

export default function App() {
  return (
    <Switch>
      {/* Home */}
      <Route path="/" component={Home} />

      {/* Auth */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />

      {/* Main App */}
      <Route path="/ask" component={Ask} />
      <Route path="/feed" component={Feed} />

      {/* Fallback */}
      <Route>Page Not Found</Route>
    </Switch>
  );
}
