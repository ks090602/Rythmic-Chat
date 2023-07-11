import Homepage from "./pages/HomePage";
import "./App.css";
import { Route } from "react-router-dom";
import Chatpage from "./pages/ChatPage";
import { library } from '@fortawesome/fontawesome-svg-core'

// import your icons
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

function App() {
  return (
    <div className = "app">
      <Route path = "/" component={Homepage} exact />
      <Route path = "/chats" component={Chatpage}  />
    </div>
  );
}

export default App;
library.add(fab, fas, far)
