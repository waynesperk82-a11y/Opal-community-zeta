import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import Feed from "./pages/Feed";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/feed" component={Feed} />
    </Switch>
  );
}

export default App;
