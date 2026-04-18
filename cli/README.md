# CacheCash CLI

Java CLI scaffold สำหรับใช้ทดสอบ flow หลักของ CacheCash แบบ directory-based และใช้เป็น demo harness ได้

## Sample Commands

1. `mvn exec:java -Dexec.args="init-org"`
2. `mvn exec:java -Dexec.args="create-project"`
3. `mvn exec:java -Dexec.args="submit-expense"`
4. `mvn exec:java -Dexec.args="show-dashboard"`
5. `mvn exec:java -Dexec.args="export-report"`

## Environment

CLI จะพยายามอ่าน env จากไฟล์ `cachecash-config/.env` ที่อยู่นอกรีโป ถ้าไม่ได้ตั้ง `ENV_FILE_PATH` เอง
