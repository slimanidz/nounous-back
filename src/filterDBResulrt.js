const filterDBResult = (rows) =>
  rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map((item) => item.filter((field) => field !== null))
    )
  );
export default filterDBResult;
