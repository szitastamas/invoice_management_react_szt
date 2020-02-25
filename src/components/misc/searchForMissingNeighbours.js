export default (invoiceArray) => {
    const invoiceNrs = [...invoiceArray.map(inv => parseInt(inv.invoiceNr, 10))];

    const missingOnes = invoiceNrs.filter((num, index) => {
      if (index < invoiceNrs.length - 1 && index !== 0) {
        return invoiceNrs.indexOf(num + 1) < 0;
      }
    });
    return missingOnes;
  };