import React, { useState, useEffect, useContext } from 'react';
import InvoiceContext from '../../contexts/invoice/InvoiceContext';
import AlertContainer from '../alert/AlertContainer';
import AlertContext from '../../contexts/alert/AlertContext';
import CustomCheckBox from '../misc/CustomCheckBox';

export const InvoiceForm = () => {
	// Setting current year and current month for input / select fields
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();

	// Bringing in many things from InvoiceContext to handle CRUD operations
	const { addInvoice, current, editInvoice, removeCurrent, months } = useContext(
		InvoiceContext
	);

	const { setAlert } = useContext(AlertContext);

	// Defining a local state to determine if an invoice is being added or being edited / updated
	const [isEditState, setIsEditState] = useState(false);

	// Setting up the invoice model with default values as local state for CRUD operations
	const [invoice, setInvoice] = useState({
		invoiceNr: '',
		year: localStorage['currentlyUsedYear'] == null ? currentYear : localStorage['currentlyUsedYear'],
		month: localStorage['currentlyUsedMonth'] == null ? currentMonth : localStorage['currentlyUsedMonth'],
		note: '',
		isDone: false
	});

	// Destructoring invoice state for ease of usage
	const { invoiceNr, year, month, note, isDone } = invoice;

	// At ComponentDidMount determining if the state is edit state
	// Setting focus on the Invoice Number field
	useEffect(() => {
		if (current) {
			setIsEditState(true);
			setInvoice(current);
			focusInvoiceNrField();
		}
	}, [current]);

	const handleSubmit = (e) => {
		e.preventDefault();

		// Setting the currently used number of month and year to local storage to preserve it for the next invoice
		localStorage.setItem('currentlyUsedMonth', month);
		localStorage.setItem('currentlyUsedYear', year);

		// Checking if the Invoice Nr. has been inserted
		// If NO, an alert will be shown
		// if YES, there will be another crossroads: are we in the Edit State (updating an invoice) or are we inserting a new one?
		if (invoiceNr.length === 0 || invoiceNr == null) {
			const msg = {
				text: 'Error: Invoice Number cannot be left empty',
				msgType: 'fail'
			};
			setAlert(msg);
		} else {
			isEditState ? editInvoice(invoice) : addInvoice(invoice);

			// Resetting the form after updating / adding an invoice
			reset();
		}
	};

	const handleChange = (e) => {
		setInvoice({
			...invoice,
			[e.target.name]: e.target.value
		});
	};

	const handleIsDoneToggle = (e) => {
		setInvoice({
			...invoice,
			isDone: !invoice.isDone
		});
	};

	const cancelEdit = () => {
		reset();
	};

	const reset = () => {
		setInvoice({
			invoiceNr: '',
			year: localStorage['currentlyUsedYear'] == null ? currentYear : localStorage['currentlyUsedYear'],
			month: localStorage['currentlyUsedMonth'] == null ? currentMonth : localStorage['currentlyUsedMonth'],
			note: '',
			isDone: false
		});

		setIsEditState(false);
		removeCurrent();
		focusInvoiceNrField();
	};

	const focusInvoiceNrField = () => {
		document.getElementById('invoiceNr').focus();
	};

	return (
		<div className='form-container'>
			<h6 className='blue-text'>Add new invoice</h6>
			<form onSubmit={handleSubmit}>
				<div className='input-field'>
					<input
						type='number'
						name='invoiceNr'
						id='invoiceNr'
						value={invoiceNr}
						onChange={handleChange}
						autoFocus
						placeholder='Invoice Number'
					/>
				</div>
				<div className='input-field'>
					<input type='number' name='year' onChange={handleChange} value={year} placeholder='Year' />
					<div className='input-field'>
						<select name='month' onChange={handleChange} value={month} className='browser-default'>
							{months.map((m, index) => (
								<option key={m} value={index+1}>
									{m}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className='input-field'>
					<input type='text' name='note' onChange={handleChange} value={note} placeholder='Note' />
				</div>

				<div className='input-field'>
					<span className='grey-text text-darken-1'>
						<strong>Done</strong>
					</span>
					<CustomCheckBox cbFor={isDone} cbMethod={handleIsDoneToggle} />
				</div>

				{isEditState ? (
					<div className='input-field'>
						<div className='divider'></div>
						<div className='row my-1'>
							<div className='col s6'>
								<button type='submit' className='btn green darken-2'>
									Update
								</button>
							</div>
							<div className='col s6'>
								<div className='btn yellow darken-2' onClick={cancelEdit}>
									Cancel
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className='input-field'>
						<button type='submit' className='btn blue darken-2 form-btn'>
							Add
						</button>
					</div>
				)}
			</form>
			<AlertContainer />
		</div>
	);
};

export default InvoiceForm;
