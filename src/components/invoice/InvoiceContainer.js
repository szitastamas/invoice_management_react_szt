import React, { useContext } from "react";
import InvoiceContext from "../../contexts/invoice/InvoiceContext";
import searchForMissingNeighbours from "../misc/searchForMissingNeighbours";
import searchForDuplicates from "../misc/searchForDuplicates";
import { FilteredInvoices } from "./FilteredInvoices";

export const InvoiceContainer = () => {
  const { invoices, filteredInvoices } = useContext(InvoiceContext);

  const theOnesMissingNeighbours = searchForMissingNeighbours(invoices);
  const duplicates = searchForDuplicates(invoices);

  return (
      filteredInvoices.length === 0 ? <p className="teal-text center">There are no invoices in this year and month</p> :
      <FilteredInvoices
        theOnesMissingNeighbours={theOnesMissingNeighbours}
        duplicates={duplicates}
      />
    );
};

export default InvoiceContainer;
