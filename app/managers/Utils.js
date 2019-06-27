
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
        }
}