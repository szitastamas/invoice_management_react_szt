import { 
    ADD_INVOICE, 
    LOAD_INVOICES,
    DELETE_INVOICE,
    MARK_FOR_DEATH,
    EDIT_INVOICE,
    INVOICE_ERROR,
    TRIGGER_LOADING,
    SET_CURRENT,
    REMOVE_CURRENT,
    REMOVE_MARK,
    SET_FILTERED,
    REMOVE_FILTERED
} from '../reducerTypes'

export default (state, action) => {
    switch (action.type) {
        case LOAD_INVOICES:
            return {
                ...state,
                loading: false,
                invoices: action.payload
            }
        case ADD_INVOICE:
            return {
                ...state,
                invoices: [action.payload, ...state.invoices],
                filteredInvoices: [action.payload, ...state.filteredInvoices],
                loading: false
            }
        case EDIT_INVOICE:
            return{
                ...state,
                filteredInvoices: state.filteredInvoices.map(invoice => invoice.id === action.payload.id ? action.payload : invoice),
                invoices: state.invoices.map(invoice => invoice.id === action.payload.id ? action.payload : invoice),
                loading: false
            }
        case DELETE_INVOICE:
            return {
                ...state,
                current: null,
                markedForDeath: state.markedForDeath.filter(marked => marked.id !== action.payload),
                filteredInvoices: state.filteredInvoices.filter(inv => inv.id !== action.payload),
                invoices: state.invoices.filter(invoice => invoice.id !== action.payload)
            }
        case MARK_FOR_DEATH:
            return {
                ...state,
                markedForDeath: [...state.markedForDeath, action.payload]
            }
        case REMOVE_MARK:
            return {
                ...state,
                markedForDeath: state.markedForDeath.filter(marked => marked.id !== action.payload)
            }
        case INVOICE_ERROR:
            return {
                ...state,
                invoices: [],
                current: null,
                loading: false,
                filtered: [],
                error: action.payload
            }
        case SET_CURRENT:
            return {
                ...state,
                current: action.payload
            }
        case REMOVE_CURRENT:
            return {
                ...state,
                current: null
            }
        case SET_FILTERED:
            return {
                ...state,
                filteredInvoices: action.payload,
                loading: false
            }
        case REMOVE_FILTERED:
            return {
                ...state,
                filteredInvoices: []
            }
        case TRIGGER_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}