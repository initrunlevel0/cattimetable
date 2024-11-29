ceklist_start = {
    "startup": [],
    "registrasi": ["create pin, status: off, izin pin: on", "notify ke petugas registrasi"],
    "enter": ["hide live score", "siapkan live score sesi selanjutnya (masih hidden)"],
    "ujian": ["this sesi, izin pin: off, status: on", "show live score", "notify pin sesi ke peserta", "pastikan peserta login semua", "pastikan headcount", "pastikan tandai tidak hadir"]
};


ceklist_end = {
    "startup": ["siapkan obs live score", "siapkan cctv zoom", "stream ke youtube", "cek rekaman cctv kemarin", "backup rekaman cctv", "upload ceklist-harian"],
    "registrasi": ["this sesi, izin pin: off, status: on", "notify pin sesi ke petugas BKN"],
    "enter": ["mulai pengarahan"],
    "ujian": ["pastikan peserta semua selesai", "this sesi, status: off, izin pin: off", "log ke dashboard", "upload absensi", "upload hasil"]
};

