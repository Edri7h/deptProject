import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { Toaster } from "sonner"
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>

    <BrowserRouter>
      <Toaster />

      <App />

    </BrowserRouter>
  </Provider>
);