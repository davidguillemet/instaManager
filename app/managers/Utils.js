
export default Utils = {

        getPivotDate: (filter) => {
            let pivotDate = new Date();

            pivotDate.setHours(0);
            pivotDate.setMinutes(0);
            pivotDate.setSeconds(0);
            pivotDate.setMilliseconds(0);
    
            if (filter.periodUnit == 'year') {
                const year = pivotDate.getYear();
                pivotDate.setYear(year - filter.periodCount);
            } else if (filter.periodUnit == 'month') {
                const month = pivotDate.getMonth();
                pivotDate.setMonth(month - filter.periodCount);
            } else if (filter.periodUnit == 'week') {
                const dayOfMonth = pivotDate.getDate(); // day of month
                pivotDate.setDate(dayOfMonth - filter.periodCount*7);
            } else if (filter.periodUnit == 'day') {
                const dayOfMonth = pivotDate.getDate(); // day of month
                pivotDate.setDate(dayOfMonth - filter.periodCount);
            }
            return pivotDate;
        },

        formatBigNumber: (bigNumber, digits) => {
            var si = [
                { value: 1, symbol: "" },
                { value: 1E3, symbol: "K" },
                { value: 1E6, symbol: "M" },
                { value: 1E9, symbol: "G" },
                { value: 1E12, symbol: "T" },
                { value: 1E15, symbol: "P" },
                { value: 1E18, symbol: "E" }
              ];
              var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
              var i;
              for (i = si.length - 1; i > 0; i--) {
                if (bigNumber >= si[i].value) {
                  break;
                }
              }
              return (bigNumber / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;            
        } 
}