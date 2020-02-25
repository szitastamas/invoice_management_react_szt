import React, { useState, useContext, useEffect } from 'react';
import InvoiceContext from '../../contexts/invoice/InvoiceContext';
import searchForDuplicates from '../misc/searchForDuplicates';
import searchForMissingNeighbours from '../misc/searchForMissingNeighbours';
import orderByInvoiceNrDesc from '../misc/orderByInvoiceNrDesc';
import CustomCheckBox from '../misc/CustomCheckBox';

export const InvoiceFilter = () => {
	// ONLY ONE FILTER CAN BE ACTIVE AT A TIME
	// This component's responsibility is to set the filteredInvoice InvoiceContext state which will then be rendered

	const { months, invoices, setFiltered, loading } = useContext(InvoiceContext);

	const distinctYears = Array.from(new Set(invoices.map((inv) => inv.year)));

	// Filtering for existing months
	const [monthFilter, setMonthFilter] = useState(
		localStorage['currentlyFilteredMonth'] == null ? 1 : localStorage['currentlyFilteredMonth']
	);
	const [yearFilter, setYearFilter] = useState(
		localStorage['currentlyFilteredYear'] == null ? 2020 : localStorage['currentlyFilteredYear']
	);

	useEffect(() => {
		if (!loading) {
			const filtered = invoices.filter(
				(inv) => +inv.year === +yearFilter && +inv.month === +monthFilter
			);
			setFiltered(filtered);
		}

	}, [loading]);
	// Filtering for duplicates only
	const [duplicateFilterActive, setDuplicateFilterActive] = useState(false);

	// Filtering for the ones that are missing the +1 neighbour
	const [missingNeighbourFilterActive, setMissingNeighbourFilterActive] = useState(false);

	// If user chooses to filter according to missing neighbours
	// The duplicate filter must be set to false and the InvoiceContext filteredInvoices will be set to
	// the array of invoices that are missing the +1 neighbour
	const handleMissingNeighbourFilter = (e) => {
		setMissingNeighbourFilterActive((missingNeighbourFilterActive) => !missingNeighbourFilterActive);
		setDuplicateFilterActive(false);

		// If the state of MissingNeighbourFilter is true the missing ones will be searched for by the searchForMissingneighbours algorythm
		// After the algorythm has run we will have an array of invoiceNr INTEGERS
		if (!missingNeighbourFilterActive) {
			// At this point we will have an array of the invoiceNrs of invoices that are missing the +1 neighbour
			const missingOnes = searchForMissingNeighbours(invoices);

			// The entire invoices array will be tested to filter out the ones thats invoiceNr is to be found in the missingOnes array
			const filtered = invoices
				.filter((inv) => missingOnes.includes(parseInt(inv.invoiceNr, 10)))
				.sort(orderByInvoiceNrDesc);

			// Setting the filteredInvoices InvoiceContext state to the array of invoices that we got from the prev step
			setFiltered(filtered);
		} else {
			// If the missingNeighbourFilter state is false --> we are not filtering for missing ones
			// We will set the month filter to the last used month to not have to reload all the invoices if the user has chosen to filter according to months before
			setMonthFilter(localStorage['currentlyFilteredMonth'] ? localStorage['currentlyFilteredMonth'] : '0');
			setYearFilter(localStorage['currentlyFilteredYear'] ? localStorage['currentlyFilteredYear'] : '2020');
			handleFilterSubmit(e);
		}
	};

	// This is the place to filter out all the duplicates from the invoices (the entire invoice database entries)
	// The MissingNeighbourFilter must be set to false
	// If the duplicate filter is active all the duplicates will be filtered out by the searchForDuplicates algorythm
	// After the algorythm finished running we will have an array of duplicated invoice numbers
	const handleDuplicateFilter = (e) => {
		setDuplicateFilterActive((duplicateFilterActive) => !duplicateFilterActive);
		setMissingNeighbourFilterActive(false);
		if (!duplicateFilterActive) {
			const duplicates = searchForDuplicates(invoices);
			const filtered = invoices.filter((inv) => duplicates.includes(inv.invoiceNr));
			setFiltered(filtered);
		} else {
			// If the duplicateFilter state is false we set the month filter to the currentlyFilteredMonth item from Local Storage (if available)
			// The handleFilterSubmit method will be triggered to set the filteredInvoices to the last used year-month filter combination
			setMonthFilter(localStorage['currentlyFilteredMonth'] ? localStorage['currentlyFilteredMonth'] : '0');
			setYearFilter(localStorage['currentlyFilteredYear'] ? localStorage['currentlyFilteredYear'] : '2020');
			handleFilterSubmit(e);
		}
	};

	const handleYearChange = (year) => {
		setYearFilter(year);
		localStorage.setItem('currentlyFilteredYear', year);
	};

	const handleMonthChange = (month) => {
		setMonthFilter(month);
		localStorage.setItem('currentlyFilteredMonth', month);
	};

	// Setting both special filters to false
	// Filtering the invoices for year and month
	const handleFilterSubmit = (e) => {
		e.preventDefault();
		setDuplicateFilterActive(false);
		setMissingNeighbourFilterActive(false);
		const filtered = invoices.filter(
			(inv) => +inv.year === +yearFilter && +inv.month === +monthFilter
		);
		setFiltered(filtered);
	};

	return (
		<div className='row filter-container'>
			<div className='col s12'>
				<div className='row'>
					<div className='col s6'>
						<form id='filter-form' onSubmit={handleFilterSubmit}>
							<div className='input-group'>
								<label htmlFor='year'>Filter by year</label>
								<select
									className='browser-default'
									id='year'
									value={yearFilter}
									onChange={(e) => handleYearChange(e.target.value)}
								>
									{distinctYears.map((year) => (
										<option key={year} value={year}>
											{year}
										</option>
									))}
								</select>
							</div>
							<div className='input-group'>
								<label htmlFor='monthFilter'>Filter by month</label>
								<select
									className='browser-default'
									id='monthFilter'
									value={monthFilter}
									onChange={(e) => handleMonthChange(e.target.value)}
								>
									{months.map((month, index) => {
										if (month !== 'all') {
											return (
												<option key={month} value={index+1}>
													{month}
												</option>
											);
										}
									})}
								</select>
							</div>
							<div className='input-group'>
								<button type='submit' className='btn'>
									Filter
								</button>
							</div>
						</form>
					</div>
					<div className='col s4'>
						<div className='row' style={{ marginTop: '3rem' }}>
							<div className='col s6'>
								<CustomCheckBox cbFor={duplicateFilterActive} cbMethod={handleDuplicateFilter} />
								<label>Show only duplicates</label>
							</div>
							<div className='col s6'>
								<CustomCheckBox
									cbFor={missingNeighbourFilterActive}
									cbMethod={handleMissingNeighbourFilter}
								/>
								<label>Show only missing ones</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InvoiceFilter;
