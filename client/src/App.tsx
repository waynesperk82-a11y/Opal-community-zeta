import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import AskQuestion from "./pages/AskQuestion";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/ask" component={AskQuestion} />
    </Switch>
  );
}

export default App;
