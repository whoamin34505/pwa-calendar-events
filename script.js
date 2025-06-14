document.addEventListener('DOMContentLoaded', function () {
    console.log("version 0.1.1")
    const form = document.getElementById('event-form');
    // Установить сегодняшнюю дату по умолчанию
    const startDateInput = document.getElementById('start-date');
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    startDateInput.value = `${yyyy}-${mm}-${dd}`;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();

        const startDate = document.getElementById('start-date').value;
        const startTime = document.getElementById('start-time').value;
        if (!startDate || !startTime) {
            alert("Укажите дату и время начала");
            return;
        }
        // Формат: YYYYMMDDTHHMMSS
        const dtStart = startDate.replace(/-/g, '') + 'T' + startTime.replace(':', '') + '00';

        let dtEnd = '';
        const endDate = document.getElementById('end-date').value;
        const endTime = document.getElementById('end-time').value;
        if (endDate && endTime) {
            dtEnd = endDate.replace(/-/g, '') + 'T' + endTime.replace(':', '') + '00';
        } else if (endTime && !endDate) {
            dtEnd = startDate.replace(/-/g, '') + 'T' + endTime.replace(':', '') + '00';
        } else if (!endTime && endDate) {
            dtEnd = endDate.replace(/-/g, '') + 'T235900';
        } else {
            // если ничего не указано, +1 час к старту
            const [hour, minute] = startTime.split(':').map(Number);
            const dateObj = new Date(startDate + 'T' + startTime);
            dateObj.setHours(hour + 1);
            const endHour = String(dateObj.getHours()).padStart(2, '0');
            const endMinute = String(dateObj.getMinutes()).padStart(2, '0');
            dtEnd = startDate.replace(/-/g, '') + 'T' + endHour + endMinute + '00';
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