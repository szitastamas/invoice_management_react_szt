import React, { useContext, useEffect, useState, Fragment } from "react";
import InvoiceForm from "./forms/InvoiceForm";
import InvoiceContainer from "./invoice/InvoiceContainer";
import InvoiceContext from "../contexts/invoice/InvoiceContext";
import InvoiceFilter from "./invoice/InvoiceFilter";
import Loading from "./loading/Loading";

export const Dashboard = () => {
  const { loading, loadInvoicesPerYearAndMonth, invoices } = useContext(InvoiceContext);

  useEffect(() => {

    const year =
      !localStorage["currentlyFilteredYear"] || localStorage["currentlyFilteredYear"] == "all"
        ? 2020
        : localStorage["currentlyFilteredYear"];
    const month =
      localStorage["currentlyFilteredMonth"] == null
        ? 1
        : localStorage["currentlyFilteredMonth"];
    loadInvoicesPerYearAndMonth(year, month);
    // eslint-disable-next-line
  }, []);


  return (
    <div className="row" id="dashboard-wrapper">
      <div className="col s12 m8">
        {loading ? (
          <Loading />
        ) : (
          <Fragment>
            <InvoiceContainer />
          </Fragment>
        )}
      </div>
      <div className="col s12 m3 offset-m1">
        <InvoiceForm />
      </div>
    </div>
  );
};

export default Dashboard;
