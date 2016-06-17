/**
 * Created by omer on 16/06/2016.
 */
function Clock(id) {
    var clock = $(id);
    var minutesSpan = $('.minutes');
    var secondsSpan = $('.seconds');

    var timeinterval, endtime, callback;

    this.countdown = (time, cb) => {
        timeinterval = setInterval(updateClock, 1000);
        endtime = time;
        callback = cb;
        updateClock();
    }

    function updateClock() {
        var t = getTimeRemaining(endtime);

        minutesSpan.innerHTML = t.days;
        secondsSpan.innerHTML = ('0' + t.minutes).slice(-2);

        if (t.total <= 0) {
            finish();
        }
    }

    function finish() {
        clearInterval(timeinterval);
        minutesSpan.innerHTML = '-';
        secondsSpan.innerHTML = '-';
        cb();
    }

    function stop() {
        clearInterval(timeinterval);
    }

    function getTimeRemaining(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        return {
            'total': t,
            'minutes': minutes,
            'seconds': seconds
        };
    }
};

