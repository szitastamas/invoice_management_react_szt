import React, { useContext } from 'react'
import InvoiceContext from "../../contexts/invoice/InvoiceContext";


export const MissingInvoiceDetails = ({ nextInvoiceIndex }) => {

    const { invoices } = useContext(InvoiceContext);

    const nextInvoice = [...invoices][nextInvoiceIndex];
    let invoiceNr = 0;
    if(nextInvoice){
        invoiceNr = nextInvoice.invoiceNr;
    }

    return (
        <div className="missing-invoice-details">
           Nächste Rechnung: { invoiceNr }
        </div>
    )
}

export default MissingInvoiceDetails;