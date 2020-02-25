import React, { useContext, useEffect, Fragment } from "react";
import InvoiceForm from "./forms/InvoiceForm";
import InvoiceContainer from "./invoice/InvoiceContainer";
import InvoiceContext from "../contexts/invoice/InvoiceContext";
import Loading from "./loading/Loading";

export const Dashboard = () => {
  const { loading, loadAllInvoices } = useContext(InvoiceContext);

  useEffect(() => {
    loadAllInvoices();
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
