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

ceklist_start = {
    "startup": ["sudah sarapan"],
    "registrasi": ["create pin, status: off, izin pin: on", "notify ke petugas registrasi"],
    "enter": ["hide live score", "siapkan live score sesi selanjutnya (masih hidden)"],
    "ujian": ["this sesi, izin pin: off, status: on", "show live score", "notify pin sesi ke peserta"],
    "end": ["pastikan ruangan kosong"],
    "rekapAbsen": ["minta headcount"]
};


ceklist_end = {
    "startup": ["siapkan obs live score", "siapkan cctv zoom", "stream ke youtube", "cek rekaman cctv kemarin", "backup rekaman cctv", "upload ceklist-harian"],
    "registrasi": ["this sesi, izin pin: off, status: on", "notify pin sesi ke petugas BKN"],
    "enter": ["mulai pengarahan"],
    "ujian": ["pastikan peserta semua selesai", "this sesi, status: off, izin pin: off", "log ke dashboard", "upload hasil"],
    "end": ["ba harian", "matikan live score", "segel ruang dan foto"],
    "rekapAbsen": ["semua peserta login", "cocokkan headcount dengan login", "cek livescore", "tandai tidak hadir", "upload absensi"]
};



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

        // Jadwal Rekap Absensi (Start x + 30, Start x + 60)
        jadwals.push({
            "jenis": "rekapAbsen",
            "sesi": s,
            "start": addTime(x, "00:30:00"),
            "end": addTime(x, "01:00:00"),
            "real_start": null,
            "real_end": null,
            "reminder_start": addTime(x, "00:30:00"),
            "reminder_end": addTime(x, "01:00:00"),
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
        "start": jadwals[jadwals.length - 2].end,
        "end": addTime(jadwals[jadwals.length - 2].end, "00:15:00"),
        "real_start": null,
        "real_end": null,
        "reminder_start": jadwals[jadwals.length - 2].end,
        "reminder_end": addTime(jadwals[jadwals.length - 2].end, "00:15:00"),
        "status": 0
    }

    result = [];
    //if(now < parseDate(startup.end)) result.push(startup);
    result.push(startup);
    for(x in jadwals) {
        //if(now < parseDate(jadwals[x].end)) result.push(jadwals[x]);
        result.push(jadwals[x]);
    }
    //if(now < parseDate(end.end)) result.push(end);
    result.push(end);

    // Generate checklist for each item
    for(x in result) {
        result[x]["ceklist_start"] = {};
        for(y in ceklist_start[result[x]["jenis"]]) {
            result[x]["ceklist_start"][ceklist_start[result[x]["jenis"]][y]] = false;
        }

        result[x]["ceklist_end"] = {};
        for(y in ceklist_end[result[x]["jenis"]]) {
            result[x]["ceklist_end"][ceklist_end[result[x]["jenis"]][y]] = false;
        }
    }


    return result;
}

//console.log(generate_jadwal(0, "skb", [1,2,3,4]))