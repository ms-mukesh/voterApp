export const isDefined = value => {
    if (typeof value === 'undefined') {
        return false;
    } else {
        return true;
    }
};
export const checkCommonValue = (title, message) => {
    return new Promise(resolve => {
        if (!isDefined(title) || title === '' || title === null || title.trim().length === 0) {
            alert('Please Enter a Proper Title For Notification');
            return resolve(false);
        } else if (message.title > 255) {
            alert('Maximum charater allowed upto 255 characters only');
            return resolve(false);
        } else if (
            !isDefined(message) ||
            message === '' ||
            message === null ||
            message.trim().length === 0
        ) {
            alert('Please Enter a Proper Message For Notification');
            return resolve(false);
        } else if (message.length > 2500) {
            alert('Maximum charater allowed upto 2500 character only');
            return resolve(false);
        } else {
            return resolve(true);
        }
    });
};

export const getMonthName = monthNumber => {
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
    ];
    return monthNames[monthNumber];
};

export const timeCoverter = date => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var newformat = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let time = hours + ':' + minutes + ' ' + newformat;
    return time;
};
export const removeDuplicates = (arrayName, key) => {
    var obj = {};
    for (let i = 0, len = arrayName.length; i < len; i++) obj[arrayName[i][key]] = arrayName[i];

    const tempNewArray = new Array();
    for (let key in obj) tempNewArray.push(obj[key]);
    return tempNewArray;
};
