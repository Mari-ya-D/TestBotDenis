// const { Telegraf, Markup } = require('telegraf');
// const sqlite3 = require('sqlite3').verbose();

// const bot = new Telegraf('8401346568:AAHIMEF-5rOWnI9QaZ2Yula8V8b36pnbmZQ');
// const db = new sqlite3.Database('bot.db');

// // Создаём таблицы
// db.serialize(() => {
//     db.run(`CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY,
//     tg_id INTEGER UNIQUE,
//     firstname TEXT,
//     lastname TEXT,
//     is_doctor INTEGER DEFAULT 0
//   )`);
//     db.run(`CREATE TABLE IF NOT EXISTS messages (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user_id INTEGER,
//     text TEXT,
//     sender TEXT,
//     dt DATETIME DEFAULT CURRENT_TIMESTAMP
//   )`);
// });

// const DOCTOR_IDS = [338432768];

// // Middleware для пропуска команд
// bot.use((ctx, next) => {
//     if (ctx.message && ctx.message.text && ctx.message.text.startsWith('/')) {
//         return next(); // Пропускаем команды своим обработчикам
//     }
//     return next();
// });

// bot.start((ctx) => {
//     const isDoctor = DOCTOR_IDS.includes(ctx.from.id) ? 1 : 0;
//     db.run(
//         `INSERT OR IGNORE INTO users (tg_id, firstname, lastname, is_doctor) VALUES (?, ?, ?, ?)`,
//         [ctx.from.id, ctx.from.first_name, ctx.from.last_name || '', isDoctor]
//     );
//     ctx.reply(isDoctor ? 'Добро пожаловать, врач!' : 'Здравствуйте! Ваш вопрос скоро получит ответ.');
// });

// bot.command('вопросы', (ctx) => {
//     if (!DOCTOR_IDS.includes(ctx.from.id)) {
//         ctx.reply(`Команда только для врача.`);
//         return;
//     }

//     db.all(
//         `SELECT m.id, m.user_id, u.firstname, u.lastname, m.text, m.dt
//      FROM messages m
//      LEFT JOIN users u ON m.user_id = u.tg_id
//      WHERE m.sender = 'user'
//      ORDER BY m.dt DESC
//      LIMIT 10`,
//         (err, rows) => {
//             if (err) {
//                 ctx.reply('Ошибка чтения базы.');
//                 return;
//             }
//             if (!rows.length) {
//                 ctx.reply('Вопросов пока нет.');
//                 return;
//             }

//             let result = `Последние вопросы:\n\n`;
//             rows.forEach(row => {
//                 result += `ID: ${row.user_id} (${row.firstname || ''} ${row.lastname || ''})\n`;
//                 result += `Вопрос: ${row.text}\n`;
//                 result += `Время: ${row.dt}\n\n`;
//             });
//             ctx.reply(result);
//         }
//     );
// });

// bot.on('text', (ctx) => {
//     // Если отправитель -- врач
//     if (DOCTOR_IDS.includes(ctx.from.id)) {
//         const match = ctx.message.text.match(/^(\d+):\s?([\s\S]+)/);
//         if (match) {
//             const userId = match[1];
//             const answer = match[2];
//             db.run(
//                 `INSERT INTO messages (user_id, text, sender) VALUES (?, ?, 'doctor')`,
//                 [userId, answer]
//             );
//             bot.telegram.sendMessage(userId, `Врач: ${answer}`);
//             ctx.reply(`Ответ отправлен пациенту.`);
//             return;
//         } else {
//             // Пропускаем команды
//             if (ctx.message.text.startsWith('/')) {
//                 return;
//             }
//             ctx.reply('Для ответа напишите: id пациента : текст ответа (например: 12345678: Ваш ответ)');
//             return;
//         }
//     }

//     // Если отправитель -- пациент (не врач)
//     db.run(
//         `INSERT INTO messages (user_id, text, sender) VALUES (?, ?, 'user')`,
//         [ctx.from.id, ctx.message.text]
//     );

//     DOCTOR_IDS.forEach(doctorId => {
//         bot.telegram.sendMessage(
//             doctorId,
//             `Вопрос от ${ctx.from.first_name} (id:${ctx.from.id}):\n${ctx.message.text}`
//         );
//     });
//     ctx.reply(`Ваш вопрос отправлен врачу. Ждите ответа.`);
// });

// bot.launch();





// const { Telegraf, Markup } = require('telegraf');
// const sqlite3 = require('sqlite3').verbose();

// const bot = new Telegraf('8401346568:AAHIMEF-5rOWnI9QaZ2Yula8V8b36pnbmZQ');
// const db = new sqlite3.Database('bot.db');

// // ID врача (можно список)
// const DOCTOR_IDS = [338432768];

// // Создаём таблицы
// db.serialize(() => {
//     db.run(`CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY,
//         tg_id INTEGER UNIQUE,
//         firstname TEXT,
//         lastname TEXT,
//         is_doctor INTEGER DEFAULT 0
//     )`);
//     db.run(`CREATE TABLE IF NOT EXISTS messages (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         user_id INTEGER,
//         text TEXT,
//         sender TEXT,
//         dt DATETIME DEFAULT CURRENT_TIMESTAMP
//     )`);
// });

// // /start
// bot.start((ctx) => {
//     const isDoctor = DOCTOR_IDS.includes(ctx.from.id) ? 1 : 0;
//     db.run(
//         `INSERT OR IGNORE INTO users (tg_id, firstname, lastname, is_doctor) VALUES (?, ?, ?, ?)`,
//         [ctx.from.id, ctx.from.first_name, ctx.from.last_name || '', isDoctor]
//     );
//     ctx.reply(isDoctor ? 'Добро пожаловать, врач!' : 'Здравствуйте! Ваш вопрос скоро получит ответ.');
// });

// // Команда /вопросы для врача
// bot.command('вопросы', (ctx) => {
//     if (!DOCTOR_IDS.includes(ctx.from.id)) {
//         ctx.reply(`Команда только для врача.`);
//         return;
//     }

//     db.all(
//         `SELECT m.id, m.user_id, u.firstname, u.lastname, m.text, m.dt
//          FROM messages m
//          LEFT JOIN users u ON m.user_id = u.tg_id
//          WHERE m.sender = 'user'
//          ORDER BY m.dt DESC
//          LIMIT 10`,
//         (err, rows) => {
//             if (err) {
//                 ctx.reply('Ошибка чтения базы.');
//                 return;
//             }
//             if (!rows.length) {
//                 ctx.reply('Вопросов пока нет.');
//                 return;
//             }

//             let result = `Последние вопросы:\n\n`;
//             rows.forEach(row => {
//                 result += `ID: ${row.user_id} (${row.firstname || ''} ${row.lastname || ''})\n`;
//                 result += `Вопрос: ${row.text}\n`;
//                 result += `Время: ${row.dt}\n\n`;
//             });
//             ctx.reply(result);
//         }
//     );
// });

// // Обработка входящих текстовых сообщений
// bot.on('text', (ctx) => {
//     // Если отправитель — врач
//     if (DOCTOR_IDS.includes(ctx.from.id)) {
//         const match = ctx.message.text.match(/^(\d+):\s?([\s\S]+)/);
//         if (match) {
//             const userId = match[1];
//             const answer = match[2];
//             db.run(
//                 `INSERT INTO messages (user_id, text, sender) VALUES (?, ?, 'doctor')`,
//                 [userId, answer]
//             );
//             bot.telegram.sendMessage(userId, `Врач: ${answer}`);
//             ctx.reply(`Ответ отправлен пациенту.`);
//             return;
//         } else {
//             // Пропускаем команды
//             if (ctx.message.text.startsWith('/')) {
//                 return;
//             }
//             ctx.reply('Для ответа напишите: id пациента : текст ответа (например: 12345678: Ваш ответ)');
//             return;
//         }
//     }

//     // Если отправитель — пациент (не врач)
//     db.run(
//         `INSERT INTO messages (user_id, text, sender) VALUES (?, ?, 'user')`,
//         [ctx.from.id, ctx.message.text]
//     );
//     // Отправляем врачу с кнопкой "Ответить"
//     DOCTOR_IDS.forEach(doctorId => {
//     bot.telegram.sendMessage(
//         doctorId,
//         `Вопрос от ${ctx.from.first_name} (id:${ctx.from.id}):\n${ctx.message.text}`,
//         {
//             reply_markup: {
//                 inline_keyboard: [
//                     [
//                         { text: 'Ответить', callback_data: `reply_${ctx.from.id}` }
//                     ]
//                 ]
//             }
//         }
//     );
// });
//     ctx.reply(`Ваш вопрос отправлен врачу. Ждите ответа.`);
// });

// // Обработка нажатия на кнопку "Ответить"
// bot.on('callback_query', async (ctx) => {
//     const data = ctx.callbackQuery.data;
//     if (data.startsWith('reply_')) {
//         const userId = data.split('_')[1];
//         ctx.reply(
// `Введите ответ для пациента (id:${userId}), например:\n${userId}: Ваш текст ответа`
//         );
//     }
//     await ctx.answerCbQuery();
// });

// // Запуск бота
// bot.launch();




const { Telegraf, Markup, session } = require('telegraf');
const sqlite3 = require('sqlite3').verbose();


const bot = new Telegraf('8401346568:AAHIMEF-5rOWnI9QaZ2Yula8V8b36pnbmZQ');
const db = new sqlite3.Database('bot.db');
bot.use(session()); // Добавьте эту строку для включения сессий

// ID врача (можно список)
const DOCTOR_IDS = [338432768];//338432768

db.run(`ALTER TABLE users ADD COLUMN last_activity DATETIME DEFAULT CURRENT_TIMESTAMP`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
        console.error('Ошибка при добавлении last_activity:', err.message);
    }
});

// Создаём таблицы
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        tg_id INTEGER UNIQUE,
        firstname TEXT,
        lastname TEXT,
        is_doctor INTEGER DEFAULT 0,
        last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        text TEXT,
        sender TEXT,
        dt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// /start
bot.start((ctx) => {
    const isDoctor = DOCTOR_IDS.includes(ctx.from.id) ? 1 : 0;
    db.run(
        `INSERT OR REPLACE INTO users (tg_id, firstname, lastname, is_doctor, last_activity) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [ctx.from.id, ctx.from.first_name, ctx.from.last_name || '', isDoctor]
    );

    if (isDoctor) {
        ctx.reply('Добро пожаловать, врач!',
            Markup.keyboard([
                ['Список пациентов', '❓ Последние вопросы']
            ]).resize()
        );
    } else {
        ctx.reply('Здравствуйте! Напишите ваш вопрос - врач скоро ответит.');
    }
});

// Команда для показа списка пациентов
bot.hears('Список пациентов', (ctx) => {
    if (!DOCTOR_IDS.includes(ctx.from.id)) return;

    db.all(
        `SELECT DISTINCT u.tg_id, u.firstname, u.lastname,
                (SELECT MAX(dt) FROM messages WHERE user_id = u.tg_id) as last_activity,
                (SELECT COUNT(*) FROM messages m WHERE m.user_id = u.tg_id AND m.sender = 'user' AND m.dt > COALESCE((SELECT MAX(dt) FROM messages WHERE user_id = u.tg_id AND sender = 'doctor'), '2000-01-01')) as unread_count
         FROM users u
         WHERE u.is_doctor = 0 AND u.tg_id IN (SELECT DISTINCT user_id FROM messages)
         ORDER BY last_activity DESC`,
        (err, rows) => {
            if (err) {
                console.error('SQL Error:', err); // Добавьте для отладки
                ctx.reply('Ошибка чтения базы.');
                return;
            }
            if (!rows.length) {
                ctx.reply('Пациентов пока нет.');
                return;
            }

            const buttons = rows.map(row => [
                Markup.button.callback(
                    `${row.firstname || 'Без имени'} ${row.unread_count > 0 ? `(${row.unread_count} новых)` : ''}`,
                    `patient_${row.tg_id}`
                )
            ]);

            ctx.reply('Выберите пациента:', Markup.inlineKeyboard(buttons));
        }
    );
});


// Команда для последних вопросов
bot.hears('❓ Последние вопросы', (ctx) => {
    if (!DOCTOR_IDS.includes(ctx.from.id)) return;

    db.all(
        `SELECT m.id, m.user_id, u.firstname, u.lastname, m.text, m.dt
         FROM messages m
         LEFT JOIN users u ON m.user_id = u.tg_id
         WHERE m.sender = 'user'
         ORDER BY m.dt DESC
         LIMIT 10
          last_activity TEXT`
        ,
        (err, rows) => {
            if (err) {
                ctx.reply('Ошибка чтения базы.');
                return;
            }
            if (!rows.length) {
                ctx.reply('Вопросов пока нет.');
                return;
            }

            let result = `Последние вопросы:\n\n`;
            rows.forEach(row => {
                result += `👤 ${row.firstname || ''} ${row.lastname || ''} (ID:${row.user_id})\n`;
                result += `❓ ${row.text}\n`;
                result += `⏰ ${row.dt}\n\n`;
            });
            ctx.reply(result);
        }
    );
});

// Просмотр переписки с конкретным пациентом
bot.action(/patient_(\d+)/, (ctx) => {
    const userId = ctx.match[1];

    db.all(
        `SELECT m.*, u.firstname, u.lastname 
         FROM messages m 
         LEFT JOIN users u ON m.user_id = u.tg_id
WHERE m.user_id = ? 
         ORDER BY m.dt ASC`,
        [userId],
        (err, rows) => {
            if (err || !rows.length) {
                ctx.reply('История переписки пуста.');
                return;
            }

            let history = `📋 Переписка с пациентом:\n\n`;
            rows.forEach(row => {
                const prefix = row.sender === 'user' ? '👤 Пациент:' : '👨‍⚕️ Врач:';
                history += `${prefix} ${row.text}\n`;
                history += `⏰ ${row.dt}\n\n`;
            });

            // Кнопки для ответа и возврата
            const keyboard = Markup.inlineKeyboard([
                [Markup.button.callback('💬 Ответить', `reply_${userId}`)],
                [Markup.button.callback('📋 Назад к списку', 'back_to_list')]
            ]);

            ctx.editMessageText(history, keyboard);
        }
    );
});

// Ответ пациенту
bot.action(/reply_(\d+)/, (ctx) => {
    const userId = ctx.match[1];
    
    ctx.reply(`Введите ответ для пациента (ID:${userId}):`);
    ctx.session = ctx.session || {};
    ctx.session.replyingTo = userId;
    
});

// Возврат к списку пациентов
bot.action('back_to_list', (ctx) => {
    db.all(
        `SELECT DISTINCT u.tg_id, u.firstname, u.lastname, u.last_activity,
                (SELECT COUNT(*) FROM messages m WHERE m.user_id = u.tg_id AND m.sender = 'user' AND m.dt > COALESCE((SELECT MAX(dt) FROM messages WHERE user_id = u.tg_id AND sender = 'doctor'), '2000-01-01')) as unread_count
         FROM users u
         JOIN messages m ON u.tg_id = m.user_id
         WHERE u.is_doctor = 0
         ORDER BY u.last_activity DESC`,
        (err, rows) => {
            if (err || !rows.length) {
                ctx.editMessageText('Пациентов пока нет.');
                return;
            }

            const buttons = rows.map(row => [
                Markup.button.callback(
                    `${row.firstname || 'Без имени'} ${row.unread_count > 0 ? `(${row.unread_count} новых)` : ''}`,
                    `patient_${row.tg_id}`
                )
            ]);

            ctx.editMessageText('Выберите пациента:', Markup.inlineKeyboard(buttons));
        }
    );
});

// Обработка входящих текстовых сообщений
bot.on('text', (ctx) => {
    // Если отправитель -- врач
    if (DOCTOR_IDS.includes(ctx.from.id)) {
        // Если врач отвечает через сессию
        if (ctx.session && ctx.session.replyingTo) {
            const userId = ctx.session.replyingTo;
            const answer = ctx.message.text;

            db.run(
                `INSERT INTO messages (user_id, text, sender) VALUES (?, ?, 'doctor')`,
                [userId, answer]
            );

            // Обновляем время последней активности пациента
            db.run(
                `UPDATE users SET last_activity = CURRENT_TIMESTAMP WHERE tg_id = ?`,
                [userId]
            );

            bot.telegram.sendMessage(userId, `👨‍⚕️ Врач: ${answer}`);
            ctx.reply(`✅ Ответ отправлен пациенту.`);

            // Очищаем сессию
            delete ctx.session.replyingTo;
            return;
        }

        // Пропускаем команды
        if (ctx.message.text.startsWith('/')) {
            return;
        }

        ctx.reply('Для ответа выберите пациента из списка или используйте команду "📋 Список пациентов"');
        return;
    }

    // Если отправитель -- пациент (не врач)
    db.run(
        `INSERT INTO messages (user_id, text, sender) VALUES (?, ?, 'user')`,
        [ctx.from.id, ctx.message.text]
    );

    // Обновляем время последней активности пациента
    db.run(
        `UPDATE users SET last_activity = CURRENT_TIMESTAMP WHERE tg_id = ?`,
        [ctx.from.id]
    );

    // Отправляем врачу с кнопкой "Ответить"
    DOCTOR_IDS.forEach(doctorId => {
        bot.telegram.sendMessage(
            doctorId,
            `❓ Новый вопрос от ${ctx.from.first_name} (ID:${ctx.from.id}):\n${ctx.message.text}`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: '💬 Ответить', callback_data: `reply_${ctx.from.id}` },
                            { text: '📋 История', callback_data: `patient_${ctx.from.id}` }
                        ]
                    ]
                }
            }
        );
    });

    ctx.reply(`✅ Ваш вопрос отправлен врачу. Ждите ответа.`);
});

// Запуск бота
bot.launch().then(() => {
    console.log('Бот запущен!');
});

// Корректное завершение работы
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
























