<?php
// ตั้งค่า Header ให้พ่นออกเป็น JSON และรองรับภาษาไทย
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); 

// 1. ตั้งค่าการเชื่อมต่อฐานข้อมูล (พี่ต้องแก้ 4 บรรทัดนี้ให้ตรงกับ Hosting ของพี่ครับ)
$host = 'localhost';
$db   = 'your_database_name';
$user = 'your_db_user';
$pass = 'your_db_password';

// เชื่อมต่อ MySQL
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
$conn->set_charset("utf8mb4");

// 2. ดึงข้อมูลแบบ JOIN 3 ตาราง
$sql = "SELECT 
            s.name_th AS sector_name, 
            f.name_th AS function_name,
            t.title, 
            t.role_content, 
            t.context_content, 
            t.task_content, 
            t.format_content
        FROM templates t
        JOIN functions f ON t.function_id = f.id
        JOIN sectors s ON f.sector_id = s.id
        WHERE t.is_published = 1
        ORDER BY s.id, f.id, t.id";

$result = $conn->query($sql);
$data = [];

// 3. จัดโครงสร้าง JSON ให้ตรงกับที่ Frontend ต้องการ
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // จับคู่ Sector และ Function มาเป็นชื่อหมวดหมู่ (เช่น "ธุรกิจ (การตลาด)")
        $categoryName = $row['sector_name'] . " (" . $row['function_name'] . ")";

        if (!isset($data[$categoryName])) {
            $data[$categoryName] = [];
        }

        // ดันข้อมูลเทมเพลตเข้าไปใน Array
        $data[$categoryName][] = [
            "title"   => $row['title'],
            "role"    => $row['role_content'],
            "context" => $row['context_content'],
            "task"    => $row['task_content'],
            "format"  => $row['format_content']
        ];
    }
}

// พ่นข้อมูลออกเป็น JSON
echo json_encode($data, JSON_UNESCAPED_UNICODE);
$conn->close();
?>