import { Route, Switch } from "wouter";
import Home from "./pages/Home";

function Login() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login Page</h1>
      <p>This is the login page.</p>
    </div>
  );
}

function Signup() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Sign Up Page</h1>
      <p>This is the sign up page.</p>
    </div>
  );
}

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
    </Switch>
  );
}

export default App;
