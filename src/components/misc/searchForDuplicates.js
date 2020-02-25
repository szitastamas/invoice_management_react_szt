export default (invoiceArray) => {
    const invoiceNrs = [...invoiceArray.map(inv => inv.invoiceNr)];
    const duplicates = invoiceNrs.reduce((acc, el, i, arr) => {
      if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el);
      return acc;
    }, []);
    return duplicates;
  };