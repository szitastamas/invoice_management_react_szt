import React, { useReducer, useContext } from "react";
import InvoiceContext from "./InvoiceContext";
import InvoiceReducer from "./InvoiceReducer";
import axios from "axios";
import {
  LOAD_INVOICES,
  ADD_INVOICE,
  DELETE_INVOICE,
  EDIT_INVOICE,
  INVOICE_ERROR,
  TRIGGER_LOADING,
  SET_CURRENT,
  REMOVE_CURRENT,
  SET_FILTERED,
  REMOVE_FILTERED
} from "../reducerTypes";
import AlertContext from "../alert/AlertContext";

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
    error: null
  };

  const { setAlert } = useContext(AlertContext);

  const [state, dispatch] = useReducer(InvoiceReducer, initialState);

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

  // This is another alternative to use filtering but I decided to filter through the invoices array on the frontend
  // const loadInvoicesPerYearAndMonth = async (year, month) => {
  //   triggerLoading();

  //   // http://localhost:45587/invoices?year=2019&month=9&_page=1&limit=40&_sort=invoiceNr&_order=desc

  //   let url = `http://localhost:45587/invoices?year=${year}&month=${month}&_sort=invoiceNr&_order=desc`;

  //     try {
  //       const res = await axios(url);
  //       dispatch({
  //         type: SET_FILTERED,
  //         payload: [...res.data].sort(orderByInvoiceNrDesc)
  //       });
  //     } catch (err) {
  //       console.error(err.message);
  //       dispatch({
  //         type: INVOICE_ERROR,
  //         payload: err.message
  //       });
  //       setAlert({
  //         text: err.message,
  //         msgType: "fail"
  //       });
  //     }
  // }

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
        text: `Invoice ${invoice.invoiceNr} added`,
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
        text: `Invoice ${invoice.invoiceNr} has been updated`,
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
        text: "Invoice sucessfully deleted",
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

	const setFiltered = (invoices) => {
    triggerLoading();
		dispatch({
			type: SET_FILTERED,
			payload: invoices
		});
	};

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
        addInvoice,
        editInvoice,
        loadAllInvoices,
        deleteInvoice,
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
