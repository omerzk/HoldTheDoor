/**
 * Created by omer on 16/06/2016.
 */
function Clock(id, cb) {
    var clock = $(id);
    var minutesSpan = $('.minutes');
    var secondsSpan = $('.seconds');
    minutesSpan.html('-');
    secondsSpan.html('-');
    var callback = cb;
    var timeinterval, endtime;

    this.countdown = (time, cb) => {
        timeinterval = setInterval(updateClock, 1000);
        endtime = time;
        updateClock();
    };

    function updateClock() {
        var t = getTimeRemaining(endtime);
        minutesSpan.html(t.minutes);
        secondsSpan.html(('0' + t.seconds).slice(-2));

        if (t.total <= 0) {
            finish();
        }
    }

    function finish() {
        this.stop();
        callback();
    }

    this.stop = () => {
        clearInterval(timeinterval);
        minutesSpan.html('-');
        secondsSpan.html('-');
    };

    function getTimeRemaining(endtime) {
        var t = Date.parse(endtime) - new Date();
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        return {
            'total': t,
            'minutes': minutes,
            'seconds': seconds
        };
    }
};

