import React, { useContext } from "react";
import InvoiceItem from "./InvoiceItem";
import InvoiceContext from "../../contexts/invoice/InvoiceContext";
import orderByInvoiceNrDesc from "../misc/orderByInvoiceNrDesc";


export const FilteredInvoices = ({ duplicates, theOnesMissingNeighbours }) => {

    const { filteredInvoices } = useContext(InvoiceContext);

    const sortedInvoices = [...filteredInvoices].sort(orderByInvoiceNrDesc)

    return (
        <ul className="collection">
          <li
            className="collection-item center blue lighten-4"
            style={{ padding: ".4rem", maxHeight: "50px" }}
          >
            <div className="row" style={{ fontWeight: "bold" }}>
              <div className="col s3 m2 fs-small">Invoice Nr.</div>
              <div className="col m1 hide-on-med-and-down fs-small">Year</div>
              <div className="col m1 hide-on-med-and-down fs-small">Month</div>
              <div className="col s2 m3 fs-small">Note</div>
              <div className="col s3 m2 fs-small">Status</div>
              <div
                className="col s3 m2 blue-text text-darken-2 right"
                style={{ textTransform: "uppercase", fontSize: ".8rem" }}
              >
                {filteredInvoices.length} invoices
              </div>
            </div>
          </li>
          {
              sortedInvoices.map((invoice) => {
                let isDuplicate = duplicates.includes(invoice.invoiceNr);
                let isMissingNeighbour = theOnesMissingNeighbours.includes(
                  parseInt(invoice.invoiceNr, 10)
                );
                  return (
                      <InvoiceItem
                        key={invoice.id}
                        invoice={invoice}
                        isDuplicate={isDuplicate}
                        isMissingNeighbour={isMissingNeighbour}
                      />
                  );
              })
            }
        </ul>
    )
}
