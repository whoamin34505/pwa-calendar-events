document.addEventListener('DOMContentLoaded', function () {
    console.log("version 0.1.2")
    const form = document.getElementById('event-form');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();

        const startDT = document.getElementById('start-dt').value;
        if (!startDT) {
            alert("Укажите дату и время начала");
            return;
        }
        // Формат YYYYMMDDTHHMMSS
        const dtStart = startDT.replace(/[-:T]/g, '') + '00';

        let dtEnd = '';
        const endDT = document.getElementById('end-dt').value;
        if (endDT) {
            dtEnd = endDT.replace(/[-:T]/g, '') + '00';
        } else {
            // если конец не указан, +1 час к старту
            const dateObj = new Date(startDT);
            dateObj.setHours(dateObj.getHours() + 1);
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');
            const hh = String(dateObj.getHours()).padStart(2, '0');
            const min = String(dateObj.getMinutes()).padStart(2, '0');
            dtEnd = `${yyyy}${mm}${dd}T${hh}${min}00`;
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