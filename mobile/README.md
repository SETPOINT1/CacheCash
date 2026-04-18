# CacheCash Mobile

React Native scaffold สำหรับ CacheCash โดยวางโครงแบบ feature-first และเตรียม placeholder screens ตาม mockup brief

## Structure

1. `src/app` จุดเริ่มต้นของแอป
2. `src/navigation` โครงสร้างนำทางระดับบน
3. `src/shared` components และ theme กลาง
4. `src/services/api` HTTP client
5. `src/features` โฟลเดอร์แยกตามโดเมนของหน้าจอ

## Environment

ค่า default จะอ่านจากไฟล์ `cachecash-config/.env` ที่อยู่นอกรีโป และใช้ไฟล์เดียวร่วมกับ backend และ CLI
