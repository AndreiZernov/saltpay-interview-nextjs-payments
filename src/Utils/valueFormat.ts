const valueFormat = (value: number, countryCurrency = '') => {
  if (!countryCurrency) return value;
  const newValue = value.toLocaleString('en-GB', {
    style: 'currency',
    currency: countryCurrency,
  });

  return newValue;
};

export default valueFormat;
