# CacheCash Detailed Use Case Specification

## 1. Document Purpose

เอกสารนี้ขยายจากเอกสารหลักของโปรเจกต์ เพื่ออธิบาย use case สำคัญในระดับที่สามารถใช้ต่อสำหรับ

1. ทำ OOAD
2. ออกแบบ API
3. ออกแบบหน้าจอ
4. ทำ test scenario
5. ทำ Java CLI simulation

## 2. Actors

| Actor | Description |
| --- | --- |
| System Admin | ผู้ดูแลระบบระดับองค์กร จัดการสมาชิก role และค่ากลาง |
| Finance or Procurement Manager | ผู้ดูแลงบ กฎอนุมัติ และการตรวจสอบทางการเงิน |
| Project Lead | เจ้าของโปรเจกต์หรือหัวหน้าทีมที่ดูแลพื้นที่โครงการ |
| Team Member | ผู้สร้างรายการค่าใช้จ่ายและแนบเอกสาร |
| Approver | ผู้อนุมัติรายการค่าใช้จ่ายตาม policy |
| Auditor | ผู้ตรวจสอบภายหลังและออกรายงานความถูกต้อง |
| System | กระบวนการอัตโนมัติ เช่น OCR, policy check, alert |
| CLI User | ผู้ทดสอบหรือผู้รัน scenario ผ่าน Java CLI |

## 3. Use Case Priority

| Priority | Use Cases |
| --- | --- |
| High | UC-03, UC-04, UC-05, UC-06, UC-08, UC-09, UC-10, UC-12, UC-14, UC-15 |
| Medium | UC-01, UC-02, UC-07, UC-11, UC-13, UC-16 |

## 4. Traceability Summary

| Use Case | Main Screens | Backend Modules | CLI Commands |
| --- | --- | --- | --- |
| UC-03 Create project | Project workspace | project | create-project |
| UC-04 Define budget and allocations | Project workspace, Budget section | budget | allocate-budget |
| UC-05 Create expense note | Expense composer | expense | submit-expense |
| UC-06 Upload receipt and run OCR | Expense composer, OCR review | receipt, integrations | attach-receipt |
| UC-07 Add quote or price reference | Expense composer | price-intelligence | add-quote |
| UC-08 Run price check | Expense composer, Approval detail | price-intelligence | run-price-check |
| UC-09 Run policy check | Expense composer, Policy center | policy | run-policy-check |
| UC-10 Submit bill request | Expense composer | expense, approval | submit-expense |
| UC-12 Approve or reject expense | Approval inbox, Approval detail | approval | approve-expense |
| UC-14 Track budget dashboard | Home dashboard | budget, report | show-dashboard |
| UC-15 Export report | Reports and export | report | export-report |

## 5. Detailed Use Cases

### UC-03 Create Project

| Field | Detail |
| --- | --- |
| Goal | สร้างพื้นที่ทำงานของโครงการเพื่อผูก budget, expense notes, members และ reports |
| Primary Actor | Project Lead |
| Supporting Actors | System Admin, Finance or Procurement Manager |
| Trigger | ผู้ใช้กดปุ่ม Create Project |
| Preconditions | ผู้ใช้ login แล้วและมีสิทธิ์สร้าง project |
| Postconditions | ระบบมี project ใหม่พร้อม owner และสถานะ active หรือ draft |

Main Flow

1. Project Lead เปิดหน้า organization home หรือ project list
2. ผู้ใช้กดปุ่ม Create Project
3. ระบบแสดงฟอร์มชื่อ project, คำอธิบาย, ช่วงเวลา, owner, currency และสมาชิกเริ่มต้น
4. ผู้ใช้กรอกข้อมูลและยืนยัน
5. ระบบตรวจสอบความครบถ้วนและสิทธิ์
6. ระบบสร้าง project และผูก owner
7. ระบบพาไปหน้า project workspace

Alternative Flows

1. ถ้าชื่อ project ซ้ำใน organization ระบบแจ้งเตือนและไม่ให้บันทึก
2. ถ้าผู้ใช้ไม่มีสิทธิ์ ระบบบล็อกการสร้างและแสดงข้อความอธิบาย

Business Rules

1. ทุก project ต้องมี owner อย่างน้อย 1 คน
2. currency ของ project ต้องสอดคล้องกับ organization ใน V1

### UC-04 Define Budget and Allocations

| Field | Detail |
| --- | --- |
| Goal | กำหนดงบรวมและกระจายงบตามหมวดบัญชี |
| Primary Actor | Finance or Procurement Manager |
| Supporting Actors | Project Lead |
| Trigger | ผู้ใช้กด Add Budget หรือ Edit Budget |
| Preconditions | project ถูกสร้างแล้ว |
| Postconditions | ระบบมี budget และ allocations พร้อมใช้ในการตรวจ budget headroom |

Main Flow

1. Finance Manager เปิด project workspace
2. ระบบแสดงส่วน budget setup
3. ผู้ใช้กำหนด total budget, period, chart of accounts และ allocations
4. ระบบคำนวณยอดรวมจาก allocations
5. หากยอดรวมตรงกับงบรวม ระบบบันทึก budget
6. ระบบแสดง budget summary บน project workspace

Alternative Flows

1. หาก allocation รวมเกิน budget ระบบแจ้ง error และไม่ให้ save
2. หาก category code ไม่อยู่ใน chart of accounts ระบบไม่ให้บันทึก

Business Rules

1. งบรวมต้องมากกว่าศูนย์
2. allocation แต่ละหมวดต้องไม่ติดลบ
3. allocation ใช้เป็นฐานสำหรับ threshold alert และ policy check

### UC-05 Create Expense Note

| Field | Detail |
| --- | --- |
| Goal | สร้างรายการค่าใช้จ่ายในรูปแบบ collaborative note |
| Primary Actor | Team Member |
| Supporting Actors | Project Lead |
| Trigger | ผู้ใช้กด New Expense Note |
| Preconditions | project และ budget มีอยู่แล้ว |
| Postconditions | ระบบมี expense note สถานะ draft |

Main Flow

1. Team Member เปิด project workspace
2. ผู้ใช้กดปุ่ม New Expense Note
3. ระบบแสดงฟอร์ม amount, category, description, vendor, expense date และ attachment area
4. ผู้ใช้กรอกข้อมูลหลัก
5. ระบบบันทึกเป็น draft
6. ผู้ใช้สามารถเพิ่ม comment หรือบันทึกต่อภายหลังได้

Alternative Flows

1. หาก amount ไม่ถูกต้อง ระบบแจ้ง validation error
2. หาก category ไม่ได้ถูกเลือก ระบบบันทึกได้แค่ draft แต่ยัง submit ไม่ได้

Business Rules

1. expense note ทุกตัวต้องผูกกับ project
2. draft แก้ไขได้จนกว่าจะ submit

### UC-06 Upload Receipt and Run OCR

| Field | Detail |
| --- | --- |
| Goal | แนบเอกสารประกอบและดึงข้อมูลสำคัญด้วย OCR |
| Primary Actor | Team Member |
| Supporting Actors | System |
| Trigger | ผู้ใช้กด Upload Receipt |
| Preconditions | expense note ถูกสร้างแล้ว |
| Postconditions | expense note มี receipt และ OCR result หรือ failure state |

Main Flow

1. ผู้ใช้เลือกภาพหรือไฟล์เอกสาร
2. ระบบอัปโหลดไฟล์และสร้าง receipt record
3. ระบบส่งงาน OCR แบบ asynchronous
4. เมื่อ OCR เสร็จ ระบบแสดง merchant, amount, date และ confidence
5. ผู้ใช้ตรวจสอบและแก้ค่าที่ไม่ถูกต้อง
6. ระบบบันทึกค่าที่ confirm แล้วกลับเข้า expense note

Alternative Flows

1. หาก OCR ล้มเหลว ระบบแจ้งให้กรอกข้อมูลด้วยมือ
2. หาก extracted amount ต่างจาก claimed amount มาก ระบบตั้ง warning flag

Business Rules

1. OCR result ไม่ถือเป็น source of truth จนกว่าผู้ใช้หรือ approver จะ confirm
2. OCR confidence ต่ำกว่าค่าที่กำหนดต้องแสดง warning

### UC-07 Add Quote or Price Reference

| Field | Detail |
| --- | --- |
| Goal | เพิ่มข้อมูลราคาเพื่อใช้เปรียบเทียบก่อนอนุมัติ |
| Primary Actor | Team Member |
| Supporting Actors | System |
| Trigger | ผู้ใช้กด Add Quote |
| Preconditions | expense note อยู่ใน draft หรือ submitted |
| Postconditions | ระบบมี quote หรือ price reference ผูกกับ expense note |

Main Flow

1. ผู้ใช้เปิด expense note
2. ผู้ใช้กด Add Quote
3. ระบบให้กรอก vendor, amount, note, quote date และไฟล์แนบถ้ามี
4. ระบบบันทึก quote
5. ระบบนำข้อมูลไปสร้างหรืออัปเดต price snapshot

Alternative Flows

1. หาก quote ซ้ำกับ vendor เดิมและวันเดียวกัน ระบบให้ replace หรือ keep both

Business Rules

1. บาง category ต้องมีอย่างน้อย 2 quotes ตาม policy

### UC-08 Run Price Check

| Field | Detail |
| --- | --- |
| Goal | ตรวจสอบว่าราคาของ expense note อยู่ในระดับสมเหตุสมผลหรือไม่ |
| Primary Actor | System |
| Supporting Actors | Team Member, Approver |
| Trigger | เกิดเมื่อมี quote ใหม่, receipt ใหม่ หรือก่อน submit |
| Preconditions | expense note มี amount และ vendor หรือ category เพียงพอให้เทียบราคา |
| Postconditions | ระบบสร้าง price insight และ price anomalies |

Main Flow

1. ระบบดึง price snapshots ที่เกี่ยวข้องจาก vendor เดิม หมวดเดียวกัน หรือ project เดิม
2. ระบบคำนวณ last price, average price และ variance
3. ระบบระบุสถานะ price insight เช่น normal, warning หรือ high risk
4. ระบบแสดงผลบน expense composer และ approval detail

Alternative Flows

1. หากยังไม่มี historical price ระบบแจ้ง insufficient data และใช้ quote comparison แทน

Business Rules

1. หาก variance สูงกว่าค่าที่กำหนด ระบบต้องแสดง warning
2. price check เป็น advisory ใน V1 เว้นแต่ policy จะบังคับ block

### UC-09 Run Policy Check

| Field | Detail |
| --- | --- |
| Goal | ประเมินรายการค่าใช้จ่ายกับกฎองค์กรก่อน submit หรือ approve |
| Primary Actor | System |
| Supporting Actors | Team Member, Approver, Finance or Procurement Manager |
| Trigger | เมื่อ draft ถูกแก้ไข, ก่อน submit, หรือก่อน approve |
| Preconditions | expense note มีข้อมูลเพียงพอ เช่น amount, category, date และ attachments |
| Postconditions | ระบบสร้าง policy checks พร้อมผล pass warning block |

Main Flow

1. ระบบโหลด policy rules ที่ active ใน organization และ project
2. ระบบ evaluate expense note ตามแต่ละ rule
3. ระบบบันทึกผลเป็น policy check records
4. ระบบสรุปผลรวมให้ user เห็นใน policy panel
5. หากมี block ระบบป้องกันการ submit หรือ approval ตาม policy

Alternative Flows

1. หากระบบ policy service ใช้งานไม่ได้ ระบบต้องแจ้ง error และไม่ควรปล่อยให้ submit แบบเงียบ

Business Rules

1. block ต้องมีเหตุผลชัดเจนและอ้างถึง rule
2. warning ต้องอนุญาตให้ไปต่อได้แต่ต้องแสดงเหตุผล

### UC-10 Submit Bill Request

| Field | Detail |
| --- | --- |
| Goal | ส่ง expense note เข้าสู่ approval workflow |
| Primary Actor | Team Member |
| Supporting Actors | System |
| Trigger | ผู้ใช้กด Submit for Approval |
| Preconditions | expense note ครบข้อมูลขั้นต่ำและไม่มี unresolved block |
| Postconditions | expense note เปลี่ยนเป็น submitted or pending approval และมี approval steps |

Main Flow

1. ผู้ใช้เปิด expense note draft
2. ระบบแสดงผล OCR, price insight และ policy result ล่าสุด
3. ผู้ใช้กด Submit for Approval
4. ระบบ validate ข้อมูลทั้งหมดอีกครั้ง
5. ระบบสร้าง approval steps ตาม threshold และ policy
6. ระบบเปลี่ยนสถานะ expense note
7. ระบบแจ้ง approver คนแรกหรือ approver ที่เกี่ยวข้อง

Alternative Flows

1. หากยังมี block ที่ไม่ได้แก้ ระบบไม่ให้ submit
2. หาก approver chain ยังไม่สมบูรณ์ ระบบแจ้ง admin or finance manager

Business Rules

1. submit สำเร็จแล้ว draft fields สำคัญบางส่วนควร lock หรือเก็บ revision history

### UC-12 Approve, Reject, Escalate Request

| Field | Detail |
| --- | --- |
| Goal | ตัดสินใจต่อ expense note ที่ถูกส่งมาอนุมัติ |
| Primary Actor | Approver |
| Supporting Actors | System |
| Trigger | Approver เปิด approval detail และกดปุ่ม action |
| Preconditions | approver มี task ที่ยัง pending |
| Postconditions | approval step และ expense note ถูกอัปเดตตามผลลัพธ์ |

Main Flow

1. Approver เปิด approval inbox
2. Approver เลือกรายการหนึ่งเพื่อดู detail
3. ระบบแสดง expense summary, receipt, price insight, policy result และ comment thread
4. Approver เลือก action ระหว่าง approve, reject, escalate หรือ request clarification
5. ระบบบันทึกเหตุผลและ timestamp
6. หาก approval chain ครบ ระบบ commit budget และเปลี่ยน expense เป็น approved
7. ระบบแจ้ง submitter และผู้เกี่ยวข้อง

Alternative Flows

1. หาก approver เลือก reject ระบบบังคับกรอกเหตุผล
2. หาก approver เลือก escalate ระบบต้องสร้าง next approval step
3. หากระบบพบว่า budget เปลี่ยนจนไม่พอระหว่าง approve ระบบต้อง re-run budget and policy validation

Business Rules

1. approval step แต่ละระดับต้องเก็บ audit trail
2. approval สำเร็จต้องกระทบ committed budget ทันที

### UC-13 Verify Post-Payment

| Field | Detail |
| --- | --- |
| Goal | ยืนยันว่ามีการจ่ายเงินจริงและปิดรายการอย่างถูกต้อง |
| Primary Actor | Finance or Procurement Manager |
| Supporting Actors | Auditor |
| Trigger | หลังรายการได้รับการอนุมัติและมีการจ่ายเงินจริง |
| Preconditions | expense note อยู่ใน approved state |
| Postconditions | expense note เปลี่ยนเป็น reimbursed or closed |

Main Flow

1. Finance Manager เปิดรายการ approved
2. ผู้ใช้กรอกข้อมูล payment reference, payment date และ payee
3. ระบบตรวจสอบความสอดคล้องกับข้อมูล expense note
4. ระบบบันทึกการยืนยันและเปลี่ยนสถานะ
5. ระบบเขียน audit log

Alternative Flows

1. หากพบ payee mismatch ระบบตั้ง exception flag และให้ auditor ตรวจเพิ่ม

### UC-14 Track Budget Dashboard

| Field | Detail |
| --- | --- |
| Goal | ให้ project lead และ finance manager เห็นภาพรวมงบและความเสี่ยง |
| Primary Actor | Project Lead |
| Supporting Actors | Finance or Procurement Manager, System |
| Trigger | ผู้ใช้เปิดหน้า dashboard |
| Preconditions | project มี budget และเริ่มมี transaction |
| Postconditions | ผู้ใช้เห็น budget utilization, pending approvals และ anomalies |

Main Flow

1. ผู้ใช้เปิด home dashboard
2. ระบบโหลด budget summary, pending approvals, alerts และ price anomalies
3. ระบบแสดงการใช้วงเงินตามหมวด
4. ผู้ใช้ drill down ไปยัง project หรือ expense note ที่เกี่ยวข้องได้

Business Rules

1. dashboard ต้องแยก approved, pending และ available budget
2. threshold alert ต้องอิง budget allocation และ policy setting

### UC-15 Export Report

| Field | Detail |
| --- | --- |
| Goal | สร้างรายงานเพื่อใช้ตรวจสอบ ส่งบัญชี หรือสรุปผลโครงการ |
| Primary Actor | Auditor |
| Supporting Actors | Finance or Procurement Manager |
| Trigger | ผู้ใช้กด Export |
| Preconditions | มีสิทธิ์เข้าถึงข้อมูลในช่วงเวลาที่ต้องการ |
| Postconditions | ระบบสร้าง report file หรือ download job |

Main Flow

1. ผู้ใช้เปิดหน้า reports
2. ผู้ใช้เลือกช่วงเวลา ประเภทรายงาน และตัวกรอง
3. ระบบ aggregate ข้อมูลจาก expense, approval, policy check และ audit log
4. ระบบสร้าง report summary และ export PDF or CSV
5. ระบบแสดงลิงก์ download หรือ job status

Alternative Flows

1. หากข้อมูลมีมาก ระบบสร้าง report job แบบ asynchronous

## 6. Recommended Acceptance Scenarios

1. ผู้ใช้สร้าง project และ budget ได้โดย allocation รวมต้องเท่ากับ total budget
2. ผู้ใช้สร้าง expense note และแนบ receipt ได้ แล้วเห็น OCR review
3. ผู้ใช้ submit expense ที่มี warning ได้ แต่ submit ที่มี block ไม่ได้
4. approver เห็น price insight และ policy result ในหน้าเดียวก่อน approve
5. dashboard สะท้อน committed budget หลัง approve ทันที
6. report export แสดงรายการ exception และ approval history

## 7. Suggested Next Modeling Steps

1. วาด use case diagram จาก actors และ use cases ในเอกสารนี้
2. สร้าง sequence diagram สำหรับ UC-06, UC-10 และ UC-12
3. ใช้ตาราง traceability เป็นฐานในการแตก backend endpoints และ mobile screens