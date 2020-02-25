import React, { useReducer, useContext, useEffect } from "react";
import InvoiceContext from "./InvoiceContext";
import InvoiceReducer from "./InvoiceReducer";
import axios from "axios";
import {
  LOAD_INVOICES,
  ADD_INVOICE,
  DELETE_INVOICE,
  MARK_FOR_DEATH,
  REMOVE_MARK,
  EDIT_INVOICE,
  INVOICE_ERROR,
  TRIGGER_LOADING,
  SET_CURRENT,
  REMOVE_CURRENT,
  SET_FILTERED,
  REMOVE_FILTERED
} from "../reducerTypes";
import AlertContext from "../alert/AlertContext";
import orderByInvoiceNrDesc from "../../components/misc/orderByInvoiceNrDesc";

export const InvoiceState = props => {
  const initialState = {
    invoices: [],
    filteredInvoices: [],
    months: [
      "Januar",
      "Februar",
      "März",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember"
    ],
    loading: false,
    current: null,
    markedForDeath: [],
    error: null
  };

  const { setAlert } = useContext(AlertContext);

  const [state, dispatch] = useReducer(InvoiceReducer, initialState);

  useEffect(() => {
    loadAllInvoices();
    // eslint-disable-next-line
  }, [])

  const triggerLoading = () => {
    dispatch({
      type: TRIGGER_LOADING
    });
  };

  const loadAllInvoices = async () => {
    triggerLoading();
    try {
      const res = await axios("http://localhost:45587/invoices?_sort=invoiceNr&_order=desc");

      dispatch({
        type: LOAD_INVOICES,
        payload: res.data
      });
    } catch (err) {
      console.error(err.message);
      dispatch({
        type: INVOICE_ERROR,
        payload: err.message
      });
      setAlert({
        text: err.message,
        msgType: "fail"
      });
    }
  };

  const loadInvoicesPerYearAndMonth = async (year, month) => {
    triggerLoading();

    // http://localhost:45587/invoices?year=2019&month=9&_page=1&limit=40&_sort=invoiceNr&_order=desc

    let url = `http://localhost:45587/invoices?year=${year}&month=${month}&_sort=invoiceNr&_order=desc`;

      try {
        const res = await axios(url);

        dispatch({
          type: SET_FILTERED,
          payload: res.data
        });
      } catch (err) {
        console.error(err.message);
        dispatch({
          type: INVOICE_ERROR,
          payload: err.message
        });
        setAlert({
          text: err.message,
          msgType: "fail"
        });
      }


  }

  const addInvoice = async invoice => {
    try {
      const res = await axios.post("http://localhost:45587/invoices", invoice, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      dispatch({
        type: ADD_INVOICE,
        payload: res.data
      });

      const msg = {
        text: `Rechnung ${invoice.invoiceNr} hinzugefügt`,
        msgType: "success"
      };

      setAlert(msg);
    } catch (err) {
      console.error(err.message);
      dispatch({
        type: INVOICE_ERROR,
        payload: err.message
      });
      const msg = {
        text: err.message,
        msgType: "fail"
      };
      setAlert(msg);
    }
  };

  const editInvoice = async invoice => {
    try {
      const res = await axios.put(
        `http://localhost:45587/invoices/${invoice.id}`,
        invoice,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      dispatch({
        type: EDIT_INVOICE,
        payload: res.data
      });

      setAlert({
        text: `Rechnung ${invoice.invoiceNr} wurde aktualisiert`,
        msgType: "success"
      });
    } catch (err) {
      console.error(err.message);
      dispatch({
        type: INVOICE_ERROR,
        payload: err.message
      });
      setAlert({
        text: err.message,
        msgType: "fail"
      })
    }
  };

  const deleteInvoice = async id => {
    try {
      await axios.delete(`http://localhost:45587/invoices/${id}`);
      dispatch({
        type: DELETE_INVOICE,
        payload: id
      });
      const msg = {
        text: "Rechnung erfolgreich gelöscht",
        msgType: "success"
      };
      setAlert(msg);
    } catch (err) {
      console.error(err.message);
      dispatch({
        type: INVOICE_ERROR,
        payload: err.message
      });
      setAlert({
        text: err.message,
        msgType: "fail"
      })
    }
  };

  const deleteMultiple = ids => {
    ids.forEach(async id => {
      try {
        await deleteInvoice(id);
      } catch (err) {
        console.error(err.message);
        setAlert({
          text: err.message,
          msgType: "fail"
        })
      }
    });
    setAlert({
      text: `${ids.length} Rechnungen gelöscht`,
      msgType: "success"
    });
  };

  const markForDeath = invoice => {
    dispatch({
      type: MARK_FOR_DEATH,
      payload: invoice
    });
  };

  const removeMark = id => {
    dispatch({
      type: REMOVE_MARK,
      payload: id
    });
  };

  const setFiltered = invoices => {
    dispatch({
      type: SET_FILTERED,
      payload: [...invoices].sort(orderByInvoiceNrDesc)
    })
  }

  const removeFiltered = () => {
    dispatch({
      type: REMOVE_FILTERED
    })
  }

  const setCurrent = invoice => {
    dispatch({
      type: SET_CURRENT,
      payload: invoice
    });
  };

  const removeCurrent = () => {
    dispatch({
      type: REMOVE_CURRENT
    });
  };

  return (
    <InvoiceContext.Provider
      value={{
        months: state.months,
        loading: state.loading,
        invoices: state.invoices,
        filteredInvoices: state.filteredInvoices,
        current: state.current,
        markedForDeath: state.markedForDeath,
        addInvoice,
        editInvoice,
        loadAllInvoices,
        loadInvoicesPerYearAndMonth,
        deleteInvoice,
        deleteMultiple,
        markForDeath,
        removeMark,
        setFiltered,
        removeFiltered,
        setCurrent,
        removeCurrent
      }}
    >
      {props.children}
    </InvoiceContext.Provider>
  );
};

export default InvoiceState;
