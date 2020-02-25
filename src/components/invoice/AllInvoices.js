import React, { useContext } from "react";
import InvoiceItem from "./InvoiceItem";
import InvoiceContext from "../../contexts/invoice/InvoiceContext";
import orderByInvoiceNrDesc from "../misc/orderByInvoiceNrDesc";

export const AllInvoices = ({
  distinctMonths,
  theOnesMissingNeighbours,
  duplicates
}) => {
  const { invoices, months } = useContext(InvoiceContext);

  const sortedInvoices = [...invoices].slice().sort(orderByInvoiceNrDesc);

  return distinctMonths.map(month => {
    return (
      <ul key={month} className="collection">
        <li
          className="collection-item center blue lighten-4"
          style={{ padding: ".4rem", maxHeight: "50px" }}
        >
          <div className="row" style={{ fontWeight: "bold" }}>
            <div className="col s3 m2 fs-small">Rechnung Nr.</div>
            <div className="col m1 hide-on-med-and-down fs-small">Jahr</div>
            <div className="col m1 hide-on-med-and-down fs-small">Monat</div>
            <div className="col s2 m3 fs-small">Bemerkung</div>
            <div className="col s3 m2 fs-small">Status</div>
            <div
              className="col s3 m2 blue-text text-darken-2 right"
              style={{ textTransform: "uppercase" }}
            >
              {months[month - 1]}
            </div>
          </div>
        </li>
        {sortedInvoices
          .filter(inv => parseInt(inv.month, 10) === month)
          .map((invoice, index) => {
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
          })}
      </ul>
    );
  });
};
