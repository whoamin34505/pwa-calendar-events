document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('event-form');
    const startInput = document.getElementById('start-dt');
    const endInput = document.getElementById('end-dt');

    // Автоматически подставлять сегодняшнюю дату и время
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const localNow = now.getFullYear() + '-' + pad(now.getMonth()+1) + '-' + pad(now.getDate()) +
        'T' + pad(now.getHours()) + ':' + pad(now.getMinutes());
    startInput.value = localNow;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const start = startInput.value;
        const end = endInput.value;

        if (!start) {
            alert("Укажите дату и время начала");
            return;
        }

        const dtStart = start.replace(/[-:T]/g, '') + '00';
        let dtEnd = '';
        if (end) {
            dtEnd = end.replace(/[-:T]/g, '') + '00';
        } else {
            // если не указано окончание, по умолчанию +1 час
            const dt = new Date(start);
            dt.setHours(dt.getHours() + 1);
            const y = dt.getFullYear();
            const m = pad(dt.getMonth()+1);
            const d = pad(dt.getDate());
            const h = pad(dt.getHours());
            const min = pad(dt.getMinutes());
            dtEnd = `${y}${m}${d}T${h}${min}00`;
        }

        const icsContent =
`BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
DTSTART:${dtStart}
DTEND:${dtEnd}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);

        // Safari/iOS — открываем в новой вкладке, иначе — скачиваем
        function isSafari() {
            return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        }

        if (isSafari()) {
            alert("На iPhone и iPad скачивание ICS-файлов ограничено. Файл откроется в новой вкладке. Используйте 'Поделиться' → 'Сохранить в Файлы' или 'Открыть в Календаре'.");
            window.open(url, '_blank');
        } else {
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title || 'event'}.ics`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);
        }
    });
});