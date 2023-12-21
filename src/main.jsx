import ReactDOM from "react-dom/client";
import AppLayout from "./layout/AppLayout";
import "@shopify/polaris/build/esm/styles.css";

import Todo from "./components/Todo/Todo";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppLayout>
    <Todo></Todo>
  </AppLayout>
);
