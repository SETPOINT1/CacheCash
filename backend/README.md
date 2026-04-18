# CacheCash Backend

NodeJS backend scaffold สำหรับ CacheCash โดยแยก MVC และ supporting layers ชัดเจน

ตอนนี้ data layer ถูกออกแบบให้ใช้ Supabase เป็นฐานข้อมูลหลักผ่าน service role key สำหรับ server-side API

## Structure

1. `src/routes` กำหนด REST endpoints
2. `src/controllers` จัดการ request and response
3. `src/services` เก็บ business logic
4. `src/repositories` เป็น data access abstraction
5. `src/models` เก็บ domain types
6. `src/middleware` จัดการ error และ not found
7. `src/integrations` สำหรับ external adapters เช่น OCR
8. `supabase/schema.sql` สำหรับสร้างตารางหลักใน Supabase

## Getting Started

1. ติดตั้ง dependencies ด้วย `npm install`
2. ตั้งค่า `ENV_FILE_PATH` ให้ชี้ไปยังไฟล์ env นอกรีโป
3. รัน `npm run dev`

ค่า default จะพยายามอ่านไฟล์จาก `cachecash-config/.env` ที่อยู่ข้างนอกรีโป และใช้ไฟล์เดียวร่วมกับ mobile และ CLI

## Required Environment Variables

1. `SUPABASE_URL` URL ของโปรเจกต์ Supabase
2. `SUPABASE_SERVICE_ROLE_KEY` service role key สำหรับ backend server
3. `SUPABASE_DB_SCHEMA` schema ที่ใช้เก็บตาราง โดย default คือ `public`

## Core API Endpoints

1. `GET /api/health`
2. `GET /api/projects`
3. `GET /api/projects/:projectId`
4. `POST /api/projects`
5. `GET /api/projects/:projectId/budget`
6. `PUT /api/projects/:projectId/budget`
7. `GET /api/expenses`
8. `GET /api/expenses/:expenseId`
9. `POST /api/expenses`
10. `POST /api/expenses/:expenseId/submit`
11. `GET /api/approvals`
12. `PATCH /api/approvals/:approvalId`
