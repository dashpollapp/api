module.exports = function (UNIX_timestamp){

    let a = new Date(UNIX_timestamp * 1000),
        months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        year = a.getFullYear(),
        month = months[a.getMonth()],
        date = a.getDate(),
        hour = a.getHours(),
        min = a.getMinutes(),
        sec = a.getSeconds();

    return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
};