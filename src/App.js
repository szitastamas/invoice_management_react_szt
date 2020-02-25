import React from "react";
import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css/dist/js/materialize.min.js";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import InvoiceState from "./contexts/invoice/InvoiceState";
import AlertState from "./contexts/alert/AlertState";
import InvoiceFilter from "./components/invoice/InvoiceFilter";

function App() {
  document.addEventListener("DOMContentLoaded", function() {
    const elems = document.querySelectorAll("select");
    M.FormSelect.init(elems, {});
  });

  return (
    <AlertState>
      <InvoiceState>
        <div className="App">
          <Navbar />
          <InvoiceFilter />
          <Dashboard />
        </div>
      </InvoiceState>
    </AlertState>
  );
}

export default App;
