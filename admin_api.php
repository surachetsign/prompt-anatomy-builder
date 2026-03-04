<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

// ตั้งค่า Database (เปลี่ยนให้ตรงกับของพี่ครับ)
$host = 'localhost:3306';
$db   = 'signbes_promptbuilder';
$user = 'signbes_promptbuilder';
$pass = 'Sign@1967';
// $host = 'localhost';
// $db   = 'your_database_name';
// $user = 'your_db_user';
// $pass = 'your_db_password';

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8mb4");

$method = $_SERVER['REQUEST_METHOD'];

// แยกการทำงานตาม HTTP Method (CRUD)
switch ($method) {
    case 'GET': // ดึงข้อมูลทั้งหมดมาแสดงในตาราง
        $sql = "SELECT t.*, f.name_th as function_name 
                FROM templates t 
                LEFT JOIN functions f ON t.function_id = f.id 
                ORDER BY t.id DESC";
        $result = $conn->query($sql);
        $data = [];
        while($row = $result->fetch_assoc()) $data[] = $row;
        echo json_encode($data);
        break;

    case 'POST': // เพิ่มเทมเพลตใหม่
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $conn->prepare("INSERT INTO templates (function_id, title, role_content, context_content, task_content, format_content, is_published) VALUES (?, ?, ?, ?, ?, ?, 1)");
        $stmt->bind_param("isssss", $data['function_id'], $data['title'], $data['role_content'], $data['context_content'], $data['task_content'], $data['format_content']);
        $stmt->execute();
        echo json_encode(['status' => 'success', 'id' => $conn->insert_id]);
        break;

    case 'DELETE': // ลบเทมเพลต
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM templates WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(['status' => 'deleted']);
        break;
}
$conn->close();
?>