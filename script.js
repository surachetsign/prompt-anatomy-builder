/**
 * Prompt Anatomy Builder - Version 2.0 (Dropdown Mode)
 */

const dom = {
    categoryList: document.getElementById('category-list'),
    roleInput: document.getElementById('role-input'),
    contextInput: document.getElementById('context-input'),
    taskInput: document.getElementById('task-input'),
    formatInput: document.getElementById('format-input'),
    magicPreview: document.getElementById('magic-preview'),
    btnCopy: document.querySelector('.btn-copy')
};

let appData = null;

// เริ่มต้นโหลดแอป
async function initApp() {
    try {
        //const response = await fetch('templates.json');
		const response = await fetch('api.php');
        if (!response.ok) throw new Error('Data fetch failed');
        appData = await response.json();
        renderSidebar();
    } catch (err) {
        console.error('Error:', err);
        dom.categoryList.innerHTML = '<p style="color:red">โหลดข้อมูลไม่สำเร็จ กรุณารันผ่าน Live Server</p>';
    }
}

// สร้าง Sidebar แบบ Dropdown (Accordion)
function renderSidebar() {
    dom.categoryList.innerHTML = '';

    for (const sector in appData) {
        // 1. สร้าง Container
        const sectorItem = document.createElement('div');
        sectorItem.className = 'category-item';

        // 2. สร้างปุ่ม Toggle (ตัวเปิดปิดหมวดหมู่)
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'dropdown-toggle';
        toggleBtn.innerHTML = `<span>📁 ${sector}</span>`;
        
        // คลิกเพื่อเปิด/ปิด
        toggleBtn.onclick = () => {
            // ปิดตัวอื่น (Accordion Mode) - ถ้าอยากให้เปิดได้พร้อมกันให้เอาบรรทัดนี้ออก
            document.querySelectorAll('.category-item').forEach(el => {
                if(el !== sectorItem) el.classList.remove('active');
            });
            sectorItem.classList.toggle('active');
        };

        // 3. สร้างรายการเทมเพลตด้านใน
        const contentDiv = document.createElement('div');
        contentDiv.className = 'dropdown-content';

        appData[sector].forEach(tmpl => {
            const btn = document.createElement('button');
            btn.className = 'template-btn';
            btn.innerText = `📄 ${tmpl.title}`;
            btn.onclick = () => loadTemplate(tmpl);
            contentDiv.appendChild(btn);
        });

        // 4. ประกอบร่าง
        sectorItem.appendChild(toggleBtn);
        sectorItem.appendChild(contentDiv);
        dom.categoryList.appendChild(sectorItem);
    }
}

// โหลดข้อมูลเข้าสู่ Anatomy Blocks
function loadTemplate(tmpl) {
    dom.roleInput.value = tmpl.role || '';
    dom.contextInput.value = tmpl.context || '';
    dom.taskInput.value = tmpl.task || '';
    dom.formatInput.value = tmpl.format || '';
    
    updatePreview();
    
    // Feedback เมื่อเลือก (สำหรับ Mobile)
    if (window.innerWidth < 768) {
        window.scrollTo({ top: 300, behavior: 'smooth' });
    }
}

// รวมร่างคำสั่ง (Live Preview Engine)
function updatePreview() {
    const role = dom.roleInput.value.trim();
    const context = dom.contextInput.value.trim();
    const task = dom.taskInput.value.trim();
    const format = dom.formatInput.value.trim();

    let result = "";
    if (role)    result += `🔴 [Role]\n${role}\n\n`;
    if (context) result += `🔵 [Context]\n${context}\n\n`;
    if (task)    result += `🟢 [Task]\n${task}\n\n`;
    if (format)  result += `🟡 [Format]\n${format}`;

    dom.magicPreview.innerText = result || "รอประกอบร่างที่นี่...";
}

// ระบบคัดลอกลง Clipboard
function copyToClipboard() {
    const text = dom.magicPreview.innerText;
    if (text === "รอประกอบร่างที่นี่..." || !text) return;

    navigator.clipboard.writeText(text).then(() => {
        const originalText = dom.btnCopy.innerText;
        dom.btnCopy.innerText = "✅ คัดลอกแล้ว!";
        dom.btnCopy.style.background = "#2ecc71";
        
        setTimeout(() => {
            dom.btnCopy.innerText = originalText;
            dom.btnCopy.style.background = "";
        }, 2000);
    });
}

// รันแอป
document.addEventListener('DOMContentLoaded', initApp);