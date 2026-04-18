# CacheCash Mockup Brief For Figma

## 1. Document Goal

เอกสารนี้ใช้เป็น brief สำหรับออกแบบหน้าจอใน Figma โดยเน้น mobile-first สำหรับ React Native และต้องสื่อ character ของ CacheCash ว่าเป็น collaborative finance notebook ที่มี price intelligence และ policy intelligence ฝังอยู่ใน workflow หลัก

## 2. Design Direction

### Product Personality

1. เชื่อถือได้
2. คล่องตัว
3. โปร่งใส
4. เป็นมิตรกับทีมขนาดเล็ก

### Visual Direction

1. โทนสีหลักควรสื่อความเป็น financial workspace มากกว่าธนาคารแข็งทื่อ
2. ใช้ card layout แบบ note stack เพื่อให้รู้สึกว่าแต่ละรายการคือบันทึกที่ทำงานร่วมกันได้
3. แยกสีของ `PASS`, `WARNING`, `BLOCK` ให้ชัดตั้งแต่ต้น
4. price insight และ policy result ควรอยู่ใน panel ที่อ่านเร็ว ไม่ซ่อนลึก

### Suggested Token Direction

1. Primary: deep teal or navy
2. Accent: warm amber สำหรับ warning
3. Danger: brick red สำหรับ block
4. Surface: off-white หรือ soft gray
5. Success: forest green

## 3. Navigation Structure

### Main Tabs

1. Home
2. Projects
3. Approvals
4. Reports
5. Settings

### Global Actions

1. Create Expense Note
2. Search
3. Notification Center
4. Organization Switch

## 4. Shared Components

1. Budget Summary Card
2. Expense Note Card
3. Price Insight Panel
4. Policy Result Panel
5. Receipt Preview Card
6. Approval Action Bar
7. Comment Composer
8. Threshold Alert Banner
9. Filter Chip Group
10. Export Action Sheet

## 5. Prototype Flows

### Flow 1: Project Setup

1. Login
2. Home
3. Create Project
4. Budget Setup
5. Project Workspace

### Flow 2: Expense Submission

1. Project Workspace
2. Create Expense Note
3. Upload Receipt
4. OCR Review
5. Price and Policy Review
6. Submit Success State

### Flow 3: Approval Decision

1. Approval Inbox
2. Approval Detail
3. Approve or Reject Modal
4. Result State

### Flow 4: Dashboard to Report

1. Home Dashboard
2. Alert Detail or Expense Detail
3. Reports Screen
4. Export Confirmation

## 6. Screen Specifications

### Screen 1: Login and Organization Switch

Purpose

1. ให้ผู้ใช้เข้าสู่ระบบและเลือก organization ที่ต้องการทำงาน

Key Areas

1. Brand area
2. Email and password form
3. SSO button placeholder
4. Organization switch drawer or modal

Main Actions

1. Sign in
2. Switch organization

States

1. Default
2. Loading
3. Invalid credentials

Figma Notes

1. หน้า login ต้องดู professional แต่ไม่แข็งจนเกินไป
2. เมื่อมีหลาย organization ควรมี simple list card ให้เลือกเร็ว

### Screen 2: Home Dashboard

Purpose

1. ให้เห็นสุขภาพขององค์กรและรายการที่ต้องตัดสินใจทันที

Key Areas

1. Header พร้อม organization name และ notification icon
2. Budget utilization cards
3. Pending approvals list
4. Policy alerts strip
5. Price anomalies section
6. Recent expense notes

Main Actions

1. Open project
2. Open approval inbox
3. Create expense note
4. View report

States

1. Normal dashboard
2. Empty organization
3. High alert state

Figma Notes

1. ควรมี section ที่ทำให้กรรมการเห็น value ของ competition feature ภายใน 3 วินาที
2. ใช้ badge หรือ sparkline สั้น ๆ ให้เห็น price anomaly ได้เร็ว

### Screen 3: Project Workspace

Purpose

1. เป็นพื้นที่รวม note, budget summary และสมาชิกของโปรเจกต์

Key Areas

1. Project header
2. Budget summary strip
3. Tabs for notes, members, activity
4. Expense note list
5. Floating create button

Main Actions

1. Create expense note
2. View member roles
3. Open note detail

States

1. With existing notes
2. Empty project
3. Near budget threshold

Figma Notes

1. อย่าให้หน้านี้เหมือน task board ธรรมดา ต้องคงความรู้สึกของ finance workspace

### Screen 4: Create Expense Note

Purpose

1. ให้ผู้ใช้สร้างรายการค่าใช้จ่ายได้เร็ว แต่ยังครบข้อมูลพอสำหรับตรวจ price และ policy

Key Areas

1. Amount input
2. Vendor input
3. Category selector
4. Description field
5. Date picker
6. Attachment uploader
7. Add quote section
8. Draft summary footer

Main Actions

1. Save draft
2. Upload receipt
3. Add quote
4. Continue to review

States

1. Empty form
2. Draft with attachment
3. Validation error state

Figma Notes

1. จัดลำดับ field ให้ amount, vendor และ category เห็นก่อน
2. receipt และ quote ควรเป็น block แยกชัดเจน

### Screen 5: OCR Review

Purpose

1. ให้ผู้ใช้ยืนยันข้อมูลที่ OCR อ่านได้ก่อนเข้าสู่การตัดสินใจ

Key Areas

1. Receipt preview
2. OCR extracted values
3. Claimed values from note
4. Difference highlight
5. Confirm corrections action

Main Actions

1. Accept OCR result
2. Edit extracted fields
3. Retry upload

States

1. OCR success
2. OCR low confidence
3. OCR failed fallback

Figma Notes

1. ใช้ layout แบบ side-by-side หรือ stacked compare card เพื่อให้เห็นความต่างเร็ว

### Screen 6: Approval Inbox

Purpose

1. รวบรวมรายการที่ approver ต้องตัดสินใจ

Key Areas

1. Filter chips
2. Sort dropdown
3. Approval cards พร้อม amount, project, requester, badges
4. Quick metrics summary

Main Actions

1. Filter list
2. Open approval detail
3. Quick approve สำหรับรายการ low risk ในอนาคต

States

1. List state
2. No pending approvals
3. Too many urgent warnings

Figma Notes

1. card แต่ละใบควรแสดง policy และ price signal แบบ compact

### Screen 7: Approval Detail

Purpose

1. ให้ approver เห็นทุกบริบทที่ต้องใช้ตัดสินใจในจอเดียว

Key Areas

1. Expense summary header
2. Receipt preview
3. Price insight panel
4. Policy result panel
5. Budget effect summary
6. Comment thread
7. Approval action bar

Main Actions

1. Approve
2. Reject
3. Escalate
4. Request clarification

States

1. Pass state
2. Warning state
3. Block state with override path

Figma Notes

1. ต้องทำให้ approver เห็นว่าถ้า approve แล้ว budget เหลือเท่าไร
2. price insight และ policy result ไม่ควรต้อง scroll ไกลมากกว่าจะเจอ

### Screen 8: Price Insight

Purpose

1. แสดงภาพรวมเชิงเปรียบเทียบของราคาในรายการนั้น

Key Areas

1. Average price card
2. Latest same-vendor price card
3. Variance indicator
4. Historical trend chart
5. Alternative vendor list

Main Actions

1. Compare quotes
2. Open source notes
3. Copy recommendation to comment

States

1. Sufficient data
2. Limited data
3. High variance warning

Figma Notes

1. chart ไม่จำเป็นต้องซับซ้อน แต่ต้องอ่านความต่างได้ทันที

### Screen 9: Policy Center

Purpose

1. แสดงกฎที่เกี่ยวข้องและผลประเมินรายการปัจจุบัน

Key Areas

1. Rule list
2. Check result list
3. Severity tags
4. Override requirements
5. Reference to organization policy

Main Actions

1. View rule detail
2. Resolve issue
3. Add override reason

States

1. All pass
2. Mixed warnings
3. Hard block

Figma Notes

1. ต้องทำให้ผู้ใช้เข้าใจเหตุผลของ rule ได้โดยไม่ต้องอ่านยาวมาก

### Screen 10: Reports and Export

Purpose

1. สร้างรายงานเพื่อสื่อสารต่อ auditor, finance และ stakeholder ภายนอก

Key Areas

1. Report type selector
2. Date range picker
3. Filters by project, category, status
4. Summary preview
5. Export actions

Main Actions

1. Generate report
2. Export PDF
3. Export CSV

States

1. No filters selected
2. Preview loaded
3. Export in progress

Figma Notes

1. ควรมี preview summary ก่อน export เพื่อให้ user มั่นใจว่าตั้ง filter ถูก

## 7. Cross-Screen Interaction Rules

1. ทุก screen ที่เกี่ยวกับ expense note ต้องมี status badge ชัดเจน
2. ทุก screen ที่เกี่ยวกับ approval ต้องเห็น price signal และ policy signal อย่างน้อยแบบสรุป
3. การกลับจาก detail ไป list ต้องจำ filter ล่าสุด
4. ปุ่ม submit หรือ approve ต้อง disabled เมื่อมี blocking issue ที่ยังไม่แก้

## 8. Content Guidelines

1. ใช้คำที่เข้าใจง่าย เช่น Approve, Reject, Escalate, Needs Fix
2. ในภาษาไทยควรแปล severity แบบตรงความหมาย เช่น ผ่าน, เตือน, บล็อก
3. ข้อความเตือนต้องบอกเหตุผลเสมอ เช่น ราคาสูงกว่าค่าเฉลี่ย 18 เปอร์เซ็นต์
4. ข้อความ block ต้องระบุ action ที่ต้องแก้ เช่น กรุณาแนบใบเสร็จก่อนส่งอนุมัติ

## 9. Handoff Checklist For Figma

1. สร้าง page แยกตาม flow ทั้ง 4 flows
2. สร้าง component set สำหรับ cards, badges, buttons และ panels ก่อนลง detail screen
3. ทำ low-fidelity ให้ครบ 10 screens ก่อน
4. เลือก 3 screens ไปทำ mid-fidelity คือ Home Dashboard, Create Expense Note และ Approval Detail
5. สร้าง prototype clickable สำหรับ flow expense submission และ approval decision