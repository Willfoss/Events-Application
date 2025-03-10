export function convertToStringMonth(month) {
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

export function convertToLongStringMonth(month) {
  let outputMonth;

  const monthObject = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    10: "October",
    11: "November",
    12: "December",
  };

  for (let key in monthObject) {
    if (month === key) {
      outputMonth = monthObject[key];
    }
  }
  return outputMonth;
}

export function convertDateToRFC(date, time) {
  let dateFormatted = date.split("/").reverse().join("");
  dateFormatted += "T";
  let timeFormatted = time.split(":").join("");
  timeFormatted += "00Z";

  return `${dateFormatted}${timeFormatted}`;
}
