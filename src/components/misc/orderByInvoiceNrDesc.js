export default (a, b) => {
    const invoiceA = parseInt(a.invoiceNr, 10);
    const invoiceB = parseInt(b.invoiceNr, 10);
  
    let comparison = 0;
    if (invoiceA > invoiceB) comparison = -1;
    else if (invoiceB > invoiceA) comparison = 1;
    return comparison;
  };