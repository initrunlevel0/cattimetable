var sesi_start = {
    "skb": ["08:00:00", "10:30:00", "13:00:00", "15:30:00"],
    "pppk": ["08:00:00", "11:00:00", "14:00:00"] 
}

var sesi_start_jumat = {
    "skb": ["08:00:00", "15:00:00"],
    "pppk": ["08:00:00", "14:30:00"]
}

var waktu_ujian = {
    "skb": "01:45:00",
    "pppk": "02:30:00"
}

function addTime(a, b) {
    const [hoursA, minutesA, secondsA] = a.split(":").map(Number);
    const [hoursB, minutesB, secondsB] = b.split(":").map(Number);

    // Calculate total seconds
    const totalSeconds = (hoursA + hoursB) * 3600 + (minutesA + minutesB) * 60 + (secondsA + secondsB);

    // Convert back to hh:mm:ss format
    return formatTime(totalSeconds);
}

function substractTime(a, b) {
    const [hoursA, minutesA, secondsA] = a.split(":").map(Number);
    const [hoursB, minutesB, secondsB] = b.split(":").map(Number);

    // Calculate total seconds for both times
    const totalSecondsA = hoursA * 3600 + minutesA * 60 + secondsA;
    const totalSecondsB = hoursB * 3600 + minutesB * 60 + secondsB;

    // Subtract seconds, ensuring no negative time
    const totalSeconds = Math.max(0, totalSecondsA - totalSecondsB);

    // Convert back to hh:mm:ss format
    return formatTime(totalSeconds);
}

// Helper function to format seconds into hh:mm:ss
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function parseDate(timeString) {
    const now = new Date(); // Current date
    const [hours, minutes,seconds] = timeString.split(":").map(Number); // Extract hours and minutes
    const parsedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
    return parsedDate;
}

function generate_jadwal(now, hari, jenis, sesi) {
    jadwals = []
    for(i in sesi) {
        s = sesi[i];
        if(hari == 5) {
            x = sesi_start_jumat[jenis][s-1]
        } else {
            x = sesi_start[jenis][s-1]
        }

        // Jadwal Registrasi (Start x - 01:30:00, End x - 00:05:00)
        jadwals.push({
            "jenis": "registrasi",
            "sesi": s,
            "start": substractTime(x, "01:30:00"),
            "end": substractTime(x, "00:05:00"),
            "real_start": null,
            "real_end": null,
            "reminder_start": substractTime(x, "01:30:00"),
            "reminder_end": substractTime(x, "00:05:00"),
            "status": 0
        });

        // Jadwal Masukkan Peserta (Start x - 00:30:00, End x - 00:10:00)
        jadwals.push({
            "jenis": "enter",
            "sesi": s,
            "start": substractTime(x, "00:20:00"),
            "end": substractTime(x, "00:05:00"),
            "real_start": null,
            "real_end": null,
            "reminder_start": substractTime(x, "00:20:00"),
            "reminder_end": substractTime(x, "00:05:00"),
            "status": 0
        });
        // Jadwal Ujian (Start x, End x + waktu_ujian)

        jadwals.push({
            "jenis": "ujian",
            "sesi": s,
            "start": x,
            "end": addTime(x, waktu_ujian[jenis]),
            "real_start": null,
            "real_end": null,
            "reminder_start": x,
            "reminder_end": addTime(x, waktu_ujian[jenis]),
            "status": 0
        });


    }



    startup = {
        "jenis": "startup",
        "sesi": null,
        "start": substractTime(jadwals[0].start, "00:15:00"),
        "end": jadwals[0].start,
        "real_start": null,
        "real_end": null,
        "reminder_start": substractTime(jadwals[0].start, "00:15:00"),
        "reminder_end": jadwals[0].start,
        "status": 0
    };

    end = {
        "jenis": "end",
        "sesi": null,
        "start": jadwals[jadwals.length - 1].end,
        "end": addTime(jadwals[jadwals.length - 1].end, "00:15:00"),
        "real_start": null,
        "real_end": null,
        "reminder_start": jadwals[jadwals.length - 1].end,
        "reminder_end": addTime(jadwals[jadwals.length - 1].end, "00:15:00"),
        "status": 0
    }

    result = [];
    if(now < parseDate(startup.end)) result.push(startup);
    for(x in jadwals) {
        if(now < parseDate(jadwals[x].end)) result.push(jadwals[x]);
    }
    if(now < parseDate(end.end)) result.push(end);
    return result;
}

//console.log(generate_jadwal(0, "skb", [1,2,3,4]))