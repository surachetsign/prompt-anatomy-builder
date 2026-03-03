// ข้อมูลเทมเพลต (จำลองจาก Database)
const templateData = {
    "ธุรกิจ": [
        {
            title: "เขียนโพสต์ Facebook ร้านแว่น",
            role: "คุณคือผู้เชี่ยวชาญด้านการตลาดร้านแว่นตาที่มีประสบการณ์ 10 ปี",
            context: "ช่วยเขียนโพสต์ให้ร้านชื่อ [ชื่อร้าน] ตั้งอยู่ที่ [จังหวัด] เน้นกลุ่มเป้าหมาย [กลุ่มลูกค้า]",
            task: "โปรโมทเลนส์กรองแสงรุ่นใหม่ เน้นจุดเด่นเรื่อง [จุดเด่น] และใส่ Call to Action",
            format: "ความยาวไม่เกิน 200 คำ, ใช้ภาษาเป็นกันเอง, ใส่ Emoji"
        }
    ],
    "สร้างภาพ": [
        {
            title: "ภาพถ่าย Realistic Portrait",
            role: "Professional Photographer using Fujifilm settings",
            context: "A portrait of [subject] in [location] during golden hour",
            task: "Capture with sharp focus on eyes, bokeh background, cinematic lighting",
            format: "Ultra-realistic, 8k, highly detailed, film grain"
        }
    ]
};

// โหลด Sidebar
function initSidebar() {
    const list = document.getElementById('category-list');
    for (let category in templateData) {
        let div = document.createElement('div');
        div.className = 'category-item';
        div.innerHTML = `<strong>${category}</strong>`;
        templateData[category].forEach(tmpl => {
            let btn = document.createElement('button');
            btn.className = 'template-btn';
            btn.innerText = tmpl.title;
            btn.onclick = () => loadTemplate(tmpl);
            div.appendChild(btn);
        });
        list.appendChild(div);
    }
}

// เลือก Template แล้วเติมข้อมูล
function loadTemplate(tmpl) {
    document.getElementById('role-input').value = tmpl.role;
    document.getElementById('context-input').value = tmpl.context;
    document.getElementById('task-input').value = tmpl.task;
    document.getElementById('format-input').value = tmpl.format;
    updatePreview();
}

// รวมร่างคำสั่ง (Live Preview)
function updatePreview() {
    const role = document.getElementById('role-input').value;
    const context = document.getElementById('context-input').value;
    const task = document.getElementById('task-input').value;
    const format = document.getElementById('format-input').value;

    const final = `${role}\n\n${context}\n\n${task}\n\n${format}`;
    document.getElementById('magic-preview').innerText = final;
}

// คัดลอกไปที่ Clipboard
function copyToClipboard() {
    const text = document.getElementById('magic-preview').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("คัดลอกลง Clipboard เรียบร้อยแล้วครับพี่!");
    });
}

// เริ่มต้นแอป
initSidebar();