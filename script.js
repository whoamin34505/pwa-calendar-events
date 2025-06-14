document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('event-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const location = document.getElementById('Location').value;
        const start = document.getElementById('start').value;
        const end = document.getElementById('end').value;

        const today = new Date();
        const dateStr = today.toISOString().slice(0,10).replace(/-/g, '');
        const dtStart = dateStr + 'T' + start.replace(':', '') + '00';
        const dtEnd = dateStr + 'T' + (end ? end.replace(':', '') : start.replace(':', '')) + '00';

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//YourApp//EN',
            'BEGIN:VEVENT',
            `UID:${Date.now()}@yourapp`,
            `DTSTAMP:${dtStart}Z`,
            `DTSTART:${dtStart}`,
            `DTEND:${dtEnd}`,
            `SUMMARY:${title}`,
            `DESCRIPTION:${description}`,
            `LOCATION:${location}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('ICS файл создан и загружен!');
    });
});