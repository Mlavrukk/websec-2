import express from 'express';
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 5001;

// Middleware
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.json());

// API для получения расписания
app.get('/api/timetable', async (req, res) => {
    try {
        const { group, week } = req.query;
        const schedule = await parseSchedule(group, week);
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Парсер расписания
async function parseSchedule(groupId, weekNumber = 1) {
    const url = `https://ssau.ru/rasp?groupId=${groupId}&week=${weekNumber}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const days = [];
    
    $('.schedule__day').each((i, elem) => {
        const day = {
            title: $(elem).find('.schedule__day-title').text().trim(),
            classes: []
        };
        
        $(elem).find('.schedule__lesson').each((j, lesson) => {
            day.classes.push({
                time: $(lesson).find('.schedule__time').text().trim(),
                subject: $(lesson).find('.schedule__subject').text().trim(),
                type: $(lesson).find('.schedule__type').text().trim(),
                room: $(lesson).find('.schedule__place').text().trim(),
                teacher: $(lesson).find('.schedule__teacher').text().trim()
            });
        });
        
        days.push(day);
    });
    
    return { groupId, week: weekNumber, days };
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));