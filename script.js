document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('event-form');
    const startInput = document.getElementById('start-datetime');

    // Функция для получения текущего локального времени в нужном формате
    function getLocalDatetimeString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // Установка значения по умолчанию (локальное время телефона)
    startInput.value = getLocalDatetimeString();

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const startDateTime = document.getElementById('start-datetime').value;
        const endDateTime = document.getElementById('end-datetime').value;

        if (!startDateTime) {
            alert("Укажите дату и время начала");
            return;
        }

        // Формат для .ics: YYYYMMDDTHHMMSS
        const dtStart = startDateTime.replace(/[-:]/g, '').slice(0, 15) + '00';
        let dtEnd = dtStart;

        if (endDateTime) {
            dtEnd = endDateTime.replace(/[-:]/g, '').slice(0, 15) + '00';
        } else {
            const start = new Date(startDateTime);
            start.setHours(start.getHours() + 1);
            const endStr = start.toLocaleString('sv-SE').replace(' ', 'T').slice(0, 16); // YYYY-MM-DDTHH:MM
            dtEnd = endStr.replace(/[-:]/g, '') + '00';
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
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'event'}.ics`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    });
});
