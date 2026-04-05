const fs = require('fs');
const pdf = require('pdf-parse');

const files = [
    '新版《各直轄市、縣(市)政府受理兒童及少年委託安置作業流程》.pdf',
    '舊版 各直轄市、縣（市）政府委託安置作業流程-訂頒版.pdf',
    '114.05.29+剴剴案記者會簡報.pdf',
    '30087cc5-6abe-4282-a6f1-9247c8f71a1b_收出養媒合兒少的身分背景.pdf',
    '兩版對照表.pdf',
    '監察院調查報告.pdf',
    '4d5a9c74-7e83-4f24-96f0-6890fd7f3640_二、合議庭程序與角色、詰問規則基本介紹.pdf'
];

async function run() {
    for (const f of files) {
        if (fs.existsSync(f)) {
            try {
                const buf = fs.readFileSync(f);
                const data = await pdf(buf);
                fs.writeFileSync(f + '.txt', data.text);
                console.log(`OK: ${f}`);
            } catch (e) {
                console.log(`ERR: ${f} - ${e.message}`);
            }
        } else {
            console.log(`MISSING: ${f}`);
        }
    }
}
run();
