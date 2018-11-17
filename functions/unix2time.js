module.exports = function (unix){
    var timestamp = Date.now() / 1000 | 0;
    var diffdate = timestamp - unix;
    if(unix > timestamp){
        var output = "gerade eben";
    } else if(diffdate < 60) {
        if(diffdate == 1) {
            var output =  "gerade eben";
        } else {
            var output =  "vor " + diffdate + " Sekunden";
        }
    } else if(diffdate >= 60 && diffdate < 3600){
        var rounddate = diffdate / 60 | 0;
        if(rounddate == 1) {
            var output = "vor einer Minute";
        } else {
            var output = "vor " + rounddate + " Minuten";
        }
    } else if(diffdate  >= 3600 && diffdate < 86400){
        var rounddate = diffdate / 3600 | 0;
        if(rounddate == 1) {
            var output = "vor einer Stunde";
        } else {
            var output = "vor " + rounddate + " Stunden";
        }
    } else if(diffdate >= 86400 && diffdate < 604800){
        var rounddate = diffdate / 86400 | 0;
        if(rounddate == 1) {
            var output = "vor einem Tag";
        } else {
            var output = "vor " + rounddate + " Tagen";
        }
    } else {
        var rounddate = diffdate / 604800 | 0;
        if(rounddate == 1) {
            var output = "vor einer Woche";
        } else if (rounddate == 2) {
            var output = "vor " + rounddate + " Wochen";
        } else {
            var timestamp = unix * 1000;
            var heute = new Date();
            var timestamp = new Date(timestamp);
            var day = timestamp.getDate();
            var month = timestamp.getMonth();
            var year = timestamp.getFullYear();
            switch(month){
                case 0:
                    month = "Januar";
                    break;
                case 1:
                    month = "Februar";
                    break;
                case 2:
                    month = "MÃ¤rz";
                    break;
                case 3:
                    month = "April";
                    break;
                case 4:
                    month = "Mai";
                    break;
                case 5:
                    month = "Juni";
                    break;
                case 6:
                    month = "Juli";
                    break;
                case 7:
                    month = "August";
                    break;
                case 8:
                    month = "September";
                    break;
                case 9:
                    month = "Oktober";
                    break;
                case 10:
                    month = "November";
                    break;
                case 11:
                    month = "Dezember";
                    break;
                default:
                    month = "err";
                    break;
            }

            if(heute.getFullYear() == year){
                year = "";
            }

            var output = day + ". " + month + " " + year;
        }
    }
    return output;
};