export default function convertToStringMonth(month) {
  let outputMonth;
  const monthObject = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };

  for (let key in monthObject) {
    if (month === key) {
      outputMonth = monthObject[key];
    }
  }
  return outputMonth;
}
