import React, { useState, useEffect, useContext } from "react";
import InvoiceContext from "../../contexts/invoice/InvoiceContext";
import AlertContainer from "../alert/AlertContainer";
import AlertContext from "../../contexts/alert/AlertContext";
import CustomCheckBox from "../misc/CustomCheckBox";

export const InvoiceForm = () => {
  const currentDate = new Date()
    .toISOString()
    .slice(0, 10)
    .split("-");
  const currentYear = parseInt(currentDate[0], 10);
  const currentMonth = parseInt(currentDate[1], 10);

  const {
    addInvoice,
    current,
    editInvoice,
    removeCurrent,
    markedForDeath,
    deleteMultiple,
    months
  } = useContext(InvoiceContext);

  const { setAlert } = useContext(AlertContext);

  const [isEditState, setIsEditState] = useState(false);

  const [invoice, setInvoice] = useState({
    invoiceNr: "",
    year:
      localStorage["currentlyUsedYear"] == null
        ? currentYear
        : localStorage["currentlyUsedYear"],
    month:
      localStorage["currentlyUsedMonth"] == null
        ? currentMonth
        : localStorage["currentlyUsedMonth"],
    note: "",
    isDone: false
  });

  const { invoiceNr, year, month, note, isDone } = invoice;

  useEffect(() => {
    if (current) {
      setIsEditState(true);
      setInvoice(current);
      focusInvoiceNrField();
    }
  }, [current]);

  const handleSubmit = e => {
    e.preventDefault();

    // Setting the currently used number of month and year to local storage to preserve it for the next invoice
    localStorage.setItem("currentlyUsedMonth", month);
    localStorage.setItem("currentlyUsedYear", year);

    // Checking if the Invoice Nr. has been inserted
    // If NO, an alert will be shown
    // if YES, there will be another crossroads: are we in the Edit State (updating an invoice) or are we inserting a new one?
    if (invoiceNr.length === 0 || invoiceNr == null) {
      const msg = {
        text: "Fehler: Rechnungsnr. darf nicht leer sein!",
        msgType: "fail"
      };
      setAlert(msg);
    } else {
      isEditState ? editInvoice(invoice) : addInvoice(invoice);

      // Resetting the form after updating / adding an invoice
      reset();
    }
  };

  const handleChange = e => {
    setInvoice({
      ...invoice,
      [e.target.name]: e.target.value
    });
  };

  const handleIsDoneToggle = e => {
    setInvoice({
      ...invoice,
      isDone: !invoice.isDone
    });
  };

  const handleMultipleDelete = async () => {
    const markedIds = [...markedForDeath.map(marked => marked.id)];
    await deleteMultiple(markedIds);
    reset();
  };

  const cancelEdit = () => {
    reset();
  };

  const reset = () => {
    setInvoice({
      invoiceNr: "",
      year:
        localStorage["currentlyUsedYear"] == null
          ? currentYear
          : localStorage["currentlyUsedYear"],
      month:
        localStorage["currentlyUsedMonth"] == null
          ? currentMonth
          : localStorage["currentlyUsedMonth"],
      note: "",
      isDone: false
    });

    setIsEditState(false);
    removeCurrent();
    focusInvoiceNrField();
  };

  const focusInvoiceNrField = () => {
    document.getElementById("invoiceNr").focus();
  };

  return (
    <div id="form-container">
      <h6 className="blue-text">Neue rechnung hinzufügen</h6>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <input
            type="number"
            name="invoiceNr"
            id="invoiceNr"
            value={invoiceNr}
            onChange={handleChange}
            autoFocus
            placeholder="Rechnungsnummer"
          />
        </div>
        <div className="input-field">
          <input
            type="number"
            name="year"
            onChange={handleChange}
            value={year}
            placeholder="Jahr"
          />
          <div className="input-field">
            <select
              name="month"
              onChange={handleChange}
              value={month}
              className="browser-default"
            >
              {months.map((m, index) => (
                <option key={m} value={index + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="input-field">
          <input
            type="text"
            name="note"
            onChange={handleChange}
            value={note}
            placeholder="Bemerkung"
          />
        </div>

        <div className="input-field">
          <span className="grey-text text-darken-1">
            <strong>Erledigt</strong>
          </span>
          <CustomCheckBox cbFor={isDone} cbMethod={handleIsDoneToggle} />
        </div>

        {isEditState ? (
          <div className="input-field">
            <div className="divider"></div>
            <div className="row my-1">
              <div className="col s6">
                <button type="submit" className="btn green darken-2">
                  Aktualisieren
                </button>
              </div>
              <div className="col s6">
                <div className="btn yellow darken-2" onClick={cancelEdit}>
                  Abbrechen
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="input-field">
            <button type="submit" className="btn blue darken-2 form-btn">
              Hinzufügen
            </button>
          </div>
        )}
        {markedForDeath.length > 0 && (
          <div
            className="btn red darken-4 white-text"
            id="delete-all-btn"
            onClick={handleMultipleDelete}
          >
            Alle entfernen
          </div>
        )}
      </form>
      <AlertContainer />
    </div>
  );
};

export default InvoiceForm;
