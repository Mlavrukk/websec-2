document.addEventListener('DOMContentLoaded', () => {
    const groupInput = document.getElementById('groupInput');
    const weekSelect = document.getElementById('weekSelect');
    const loadBtn = document.getElementById('loadBtn');
    const scheduleContainer = document.getElementById('schedule');
    const loadingIndicator = document.getElementById('loading');
    
    loadBtn.addEventListener('click', loadSchedule);
    
    async function loadSchedule() {
        const groupId = groupInput.value.trim();
        const week = weekSelect.value;
        
        if (!groupId) {
            alert('Введите номер группы');
            return;
        }
        
        try {
            showLoading(true);
            
            const response = await fetch(`/api/timetable?group=${groupId}&week=${week}`);
            if (!response.ok) throw new Error('Ошибка сервера');
            
            const data = await response.json();
            renderSchedule(data);
        } catch (error) {
            console.error('Ошибка:', error);
            scheduleContainer.innerHTML = `<div class="error">${error.message}</div>`;
        } finally {
            showLoading(false);
        }
    }
    
    function renderSchedule(data) {
        let html = `<h2>Расписание группы ${data.groupId}, неделя ${data.week}</h2>`;
        
        if (data.days.length === 0) {
            html += '<p>Нет занятий на выбранной неделе</p>';
        } else {
            data.days.forEach(day => {
                html += `
                    <div class="day">
                        <h3 class="day-title">${day.title}</h3>
                        ${day.classes.map(cls => `
                            <div class="class">
                                <span class="time">${cls.time}</span>
                                <span class="subject">${cls.subject}</span>
                                <span class="teacher">${cls.teacher}</span>
                                <span class="room">${cls.room}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            });
        }
        
        scheduleContainer.innerHTML = html;
    }
    
    function showLoading(show) {
        loadingIndicator.classList.toggle('hidden', !show);
        scheduleContainer.classList.toggle('hidden', show);
    }
});