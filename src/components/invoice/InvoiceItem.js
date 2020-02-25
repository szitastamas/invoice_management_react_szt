import React, { useContext, useEffect, useState } from "react";
import InvoiceContext from "../../contexts/invoice/InvoiceContext";
import AlertContext from "../../contexts/alert/AlertContext";
import CustomCheckBox from "../misc/CustomCheckBox";
import MissingInvoiceDetails from "./MissingInvoiceDetails";

export const InvoiceItem = ({
  invoice: { ...invoice },
  isDuplicate,
  isMissingNeighbour
}) => {
  const { id, invoiceNr, year, month, note, isDone } = invoice;
  const {
    invoices,
    months,
    setCurrent,
    deleteInvoice,
    markForDeath,
    removeMark
  } = useContext(InvoiceContext);
  const { setAlert } = useContext(AlertContext);

  const [isMarked, setIsMarked] = useState(false);

  const handleDelete = () => {
    deleteInvoice(id);
  };

  const handleEdit = () => {
    setCurrent(invoice);
  };

  const handleMarkToggle = () => {
    setIsMarked(!isMarked);
    isMarked ? removeMark(id) : markForDeath(invoice);
  };

  useEffect(() => {
    if (isDuplicate) {
      setAlert({
        text: `${invoiceNr} ist ein Duplikat!`,
        msgType: "fail"
      });
    }
    // eslint-disable-next-line
  }, []);
  
  const nextInvoiceIndex = [...invoices].map(inv => inv.invoiceNr).indexOf(invoice.invoiceNr) - 1;

  return (
    <li
      className={`collection-item invoice-item center ${
        isMissingNeighbour ? "yellow lighten-4" : ""
      } ${isDuplicate ? "red-text red lighten-4 duplicate" : ""}`}
    >
      <div className="row">
        <div className={`col s2`}>{invoiceNr}</div>
        <div className="col s3 m1 hide-on-med-and-down">{year}</div>
        <div className="col s3 m1 hide-on-med-and-down">
          {months[month - 1]}
        </div>
        <div className="col s3">{note}</div>
        <div
          className={`col m2 fs-small ${isDone ? "green-text" : "blue-text"}`}
        >
          {isDone ? "Erledigt" : "In Bearbeitung"}
        </div>
        <div className="col s3 m3 right">
          <button
            className="btn blue btn-small"
            onClick={handleEdit}
            title="Editieren"
          >
            <i className="material-icons">edit</i>
          </button>
          <button
            className="btn red btn-small"
            onClick={handleDelete}
            title="Entfernen"
          >
            <i className="material-icons">delete</i>
          </button>
          <CustomCheckBox
            cbFor={isMarked}
            cbMethod={handleMarkToggle}
            className="mark-for-death-cb mt-xlarge"
          />
        </div>
      </div>
      {isMissingNeighbour && <MissingInvoiceDetails nextInvoiceIndex={nextInvoiceIndex} />}
    </li>
  );
};

export default InvoiceItem;
