# CacheCash

CacheCash คือแนวคิดแอปจัดการการเงินโครงการแบบ collaborative สำหรับทีมจัดซื้อ ชมรม และองค์กรขนาดเล็ก โดยรวมการสร้างโปรเจกต์ การจัดสรรงบ การขอเบิก การแนบใบเสร็จ การอนุมัติ การติดตามราคา และการตรวจนโยบายไว้ในพื้นที่ทำงานเดียว

Backend scaffold รุ่นปัจจุบันเชื่อมต่อฐานข้อมูลผ่าน Supabase แล้ว และมี schema ตัวอย่างสำหรับสร้างตารางหลักที่ [backend/supabase/schema.sql](backend/supabase/schema.sql)

เอกสารหลักของโปรเจกต์อยู่ที่ไฟล์ด้านล่าง

- [docs/CACHECASH_V1_PROJECT_DOC_TH.md](docs/CACHECASH_V1_PROJECT_DOC_TH.md)
- [docs/USE_CASE_SPEC_TH.md](docs/USE_CASE_SPEC_TH.md)
- [docs/MOCKUP_BRIEF_FIGMA_TH.md](docs/MOCKUP_BRIEF_FIGMA_TH.md)

หัวข้อสำคัญในเอกสาร

1. ภาพรวมผลิตภัณฑ์และวิสัยทัศน์
2. Use cases และ flows หลัก
3. Mockup brief และ class diagram
4. Architecture สำหรับ NodeJS, React Native และ Java CLI
5. แนวทางวาง `.env` นอกรีโปและ `.gitignore` ที่ควรใช้
6. แผนพัฒนา V1.0.0 ภายใน 2 สัปดาห์

ค่าคอนฟิกทั้งหมดถูกรวมเป็นไฟล์เดียวนอกรีโปที่ `c:/Users/polkk/working/cachecash-config/.env`

โครงสร้างเริ่มต้นที่ถูก scaffold แล้วในรีโป

1. [backend/README.md](backend/README.md) สำหรับ NodeJS MVC skeleton
2. [mobile/README.md](mobile/README.md) สำหรับ React Native skeleton
3. [cli/README.md](cli/README.md) สำหรับ Java directory CLI skeleton