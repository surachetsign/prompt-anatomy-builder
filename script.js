/**
 * Prompt Anatomy Builder - Logic Engine
 * โดย: อั่งเปา (Technical Partner)
 */

// 1. อ้างอิง Element ต่างๆ ในหน้าจอ
const dom = {
    categoryList: document.getElementById('category-list'),
    roleInput: document.getElementById('role-input'),
    contextInput: document.getElementById('context-input'),
    taskInput: document.getElementById('task-input'),
    formatInput: document.getElementById('format-input'),
    magicPreview: document.getElementById('magic-preview'),
    btnCopy: document.querySelector('.btn-copy')
};

// 2. ตัวแปรเก็บข้อมูลเทมเพลต
let appData = null;

/**
 * 3. เริ่มต้นแอป: โหลดข้อมูลเทมเพลต
 */
async function initApp() {
    try {
        // ดึงข้อมูลจากไฟล์ JSON (จำลองจาก Database)
        const response = await fetch('templates.json');
        if (!response.ok) throw new Error('โหลดไฟล์เทมเพลตไม่สำเร็จ');
        
        appData = await response.json();
        renderSidebar();
        console.log('✅ แอปพร้อมใช้งาน ข้อมูลโหลดเสร็จสิ้น');
    } catch (err) {
        console.error('❌ Error:', err);
        dom.categoryList.innerHTML = '<p style="color:#ff4b4b; padding:10px;">โหลดข้อมูลไม่สำเร็จ</p>';
    }
}

/**
 * 4. สร้างเมนู Sidebar ตามหมวดหมู่
 */
function renderSidebar() {
    dom.categoryList.innerHTML = '';

    for (const sector in appData) {
        // ส่วนหัวหมวดหมู่ (เช่น ธุรกิจ, การศึกษา)
        const sectorDiv = document.createElement('div');
        sectorDiv.className = 'category-item';
        sectorDiv.innerHTML = `<strong>📁 ${sector}</strong>`;

        // รายการเทมเพลตย่อย
        appData[sector].forEach(tmpl => {
            const btn = document.createElement('button');
            btn.className = 'template-btn';
            btn.innerText = `📄 ${tmpl.title}`;
            btn.onclick = () => loadTemplate(tmpl);
            sectorDiv.appendChild(btn);
        });

        dom.categoryList.appendChild(sectorDiv);
    }
}

/**
 * 5. โหลดข้อมูลเข้าช่อง 4 สี [Role, Context, Task, Format]
 */
function loadTemplate(tmpl) {
    dom.roleInput.value = tmpl.role || '';
    dom.contextInput.value = tmpl.context || '';
    dom.taskInput.value = tmpl.task || '';
    dom.formatInput.value = tmpl.format || '';
    
    updatePreview();
    
    // Smooth scroll สำหรับมือถือ
    if (window.innerWidth < 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * 6. ระบบรวมร่างคำสั่ง (Live Preview)
 */
function updatePreview() {
    const role = dom.roleInput.value.trim();
    const context = dom.contextInput.value.trim();
    const task = dom.taskInput.value.trim();
    const format = dom.formatInput.value.trim();

    // ประกอบร่างตาม Anatomy 4 ส่วน
    let result = "";
    if (role)    result += `[Role]\n${role}\n\n`;
    if (context) result += `[Context]\n${context}\n\n`;
    if (task)    result += `[Task]\n${task}\n\n`;
    if (format)  result += `[Format]\n${format}`;

    dom.magicPreview.innerText = result || "รอประกอบร่างที่นี่...";
}

/**
 * 7. ฟังก์ชันคัดลอก Prompt
 */
function copyToClipboard() {
    const text = dom.magicPreview.innerText;
    if (text === "รอประกอบร่างที่นี่..." || !text) return;

    navigator.clipboard.writeText(text).then(() => {
        const originalText = dom.btnCopy.innerText;
        dom.btnCopy.innerText = "✅ คัดลอกแล้ว!";
        dom.btnCopy.style.backgroundColor = "#4BFF89";
        
        setTimeout(() => {
            dom.btnCopy.innerText = originalText;
            dom.btnCopy.style.backgroundColor = "";
        }, 2000);
    });
}

/**
 * 8. โครงสร้างสำหรับการเชื่อมต่อ Gemini API (Future Expansion)
 */
async function testWithGemini() {
    const prompt = dom.magicPreview.innerText;
    if (!prompt || prompt === "รอประกอบร่างที่นี่...") return;

    console.log("🚀 กำลังส่งคำสั่งไปยัง Gemini...");
    // พี่สามารถใส่โค้ด Fetch API เพื่อยิงเข้า Backend หรือ Gemini API ได้ที่นี่
}

// เริ่มการทำงานเมื่อหน้าเว็บพร้อม
document.addEventListener('DOMContentLoaded', initApp);