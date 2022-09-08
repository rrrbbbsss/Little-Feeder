function formatDate(date) {
  const d = new Date(date);
  return `${
    d.getMonth() + 1
  }/${d.getDate()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}

module.exports = { formatDate };
