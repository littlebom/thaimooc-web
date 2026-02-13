# คู่มือการติดตั้งบน Production (Docker)

คู่มือนี้จะอธิบายขั้นตอนการนำโปรเจค Thai MOOC ไปติดตั้งบน Server จริง (Production) โดยใช้ Docker Image `llbangkokll/thai-mooc:latest` พร้อมระบบจัดการจัดการ Domain และ SSL (HTTPS) ด้วย Nginx Proxy Manager

## สิ่งที่ต้องเตรียม (Prerequisites)

- เครื่อง Server (VPS) ที่ติดตั้ง Docker และ Docker Compose เรียบร้อยแล้ว
- Domain Name ที่ชี้ (Point) มายัง IP Address ของ Server แล้ว (เช่น `thaimooc.expert`)

## ขั้นตอนที่ 1: เตรียมไฟล์บน Server

ให้สร้าง Folder ใหม่บน Server (เช่น `/opt/thaimooc`) และสร้างไฟล์ดังต่อไปนี้ข้างใน Folder นั้น

### 1. `docker-compose.yml`

สร้างไฟล์นี้เพื่อกำหนดการทำงานของทั้งระบบ (Web App, Database และ Nginx)

```yaml
version: '3.8'

services:
  app:
    image: llbangkokll/thai-mooc:latest
    container_name: thai-mooc-app
    restart: always
    # ไม่ต้องเปิด Port 3000 ออกข้างนอก เพราะเราจะใช้ npm เชื่อมผ่าน Network ภายในแทน
    # ports:
    #   - "3000:3000" 
    environment:
      - NODE_ENV=production
      # สำคัญ: แก้ไขเป็น Domain จริงของคุณ
      - NEXT_PUBLIC_BASE_URL=https://your-domain.com
      
      # การเชื่อมต่อ Database
      - DATABASE_URL=mysql://thai_mooc:secure_password@db:3306/thai_mooc
      
      # ความปลอดภัย & API
      - JWT_SECRET=change_this_to_a_long_random_string #(ตั้งรหัสยาวๆ สุ่มมั่วๆ)
      - GEMINI_API_KEY=your_gemini_api_key_here
      
      # ปรับแต่งประสิทธิภาพ Node.js
      - NODE_OPTIONS=--max-old-space-size=1536
    deploy:
      resources:
        limits:
          cpus: '1.5'
          memory: 2G
    depends_on:
      - db
    
  db:
    image: mysql:8.0
    container_name: thai-mooc-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root_password_change_me #(รหัส Root Database)
      MYSQL_DATABASE: thai_mooc
      MYSQL_USER: thai_mooc
      MYSQL_PASSWORD: secure_password #(รหัส User Database ต้องตรงกับข้างบน)
    volumes:
      - mysql_data:/var/lib/mysql

  # Nginx Proxy Manager - ตัวจัดการ Domain และ SSL (HTTPS)
  npm:
    image: 'jc21/nginx-proxy-manager:latest'
    container_name: nginx-proxy-manager
    restart: unless-stopped
    ports:
      - '80:80'   # สำหรับ HTTP
      - '81:81'   # สำหรับหน้า Admin Console
      - '443:443' # สำหรับ HTTPS
    volumes:
      - ./npm-data:/data
      - ./npm-letsencrypt:/etc/letsencrypt

volumes:
  mysql_data:
```

### 2. ตั้งค่า Domain (สำคัญ)

ในไฟล์ `docker-compose.yml` ด้านบน ต้องระวังจุดนี้:

-   `NEXT_PUBLIC_BASE_URL`: **ต้อง** เปลี่ยนเป็น Domain จริงของคุณ (เช่น `https://learning.your-university.ac.th`) เพื่อให้ระบบ Link และ Redirect ทำงานถูกต้อง

## ขั้นตอนที่ 2: เริ่มต้นระบบ

รันคำสั่งนี้ใน Folder ที่เก็บไฟล์ `docker-compose.yml`:

```bash
docker-compose up -d
```

รอสักครู่เพื่อให้ Container ทั้งหมดทำงาน (ดึง Image และเริ่มระบบ)

## ขั้นตอนที่ 3: ตั้งค่า Nginx Proxy Manager

หลังจากรันเสร็จแล้ว ให้ทำตามขั้นตอนนี้เพื่อเชื่อม Domain และเปิด HTTPS

1.  **เข้าหน้าจัดการ:** เปิด Browser ไปที่ `http://<IP-SERVER>:81`
2.  **Log in ครั้งแรก:**
    *   Email: `admin@example.com`
    *   Password: `changeme`
    *   *(ระบบจะบังคับให้เปลี่ยน Email/Password ใหม่ทันที ให้ทำตามขั้นตอน)*
3.  **เพิ่ม Domain:**
    *   ไปที่เมนู **Hosts** > **Proxy Hosts**
    *   กดปุ่ม **Add Proxy Host**
4.  **ตั้งค่า Proxy:**
    *   **Domain Names:** ใส่ชื่อโดเมนของคุณ (เช่น `thaimooc.expert`)
    *   **Scheme:** `http`
    *   **Forward Host:** `thai-mooc-app` (ใช้ชื่อนี้ได้เลย เพราะอยู่ใน Network Docker เดียวกัน)
    *   **Forward Port:** `3000`
    *   ติ๊กถูกที่: `Cache Assets`, `Block Common Exploits`, `Websockets Support`
5.  **ตั้งค่า SSL (HTTPS):**
    *   ไปที่แท็บ **SSL**
    *   **SSL Certificate:** เลือก `Request a new SSL Certificate`
    *   ติ๊กถูกที่: `Force SSL` และ `HTTP/2 Support` และ `I Agree to the Terms...`
    *   กด **Save**

🎉 **เสร็จเรียบร้อย!** ลองเข้าเว็บไซต์ผ่าน Domain ของคุณ (`https://thaimooc.expert`) ได้เลย ระบบจะปลอดภัยด้วย HTTPS

## การนำข้อมูลเข้า (Import Database)

เมื่อรันครั้งแรก Database จะว่างเปล่า คุณสามารถนำข้อมูลเดิมเข้าได้ดังนี้:
1.  **Restore Backup:** อัพโหลดไฟล์ .sql ขึ้นไปบน Server
2.  รันคำสั่ง Import:
    ```bash
    cat backup.sql | docker exec -i thai-mooc-db mysql -u root -proot_password_change_me thai_mooc
    ```
