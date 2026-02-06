# Handwriting Generation and Verification Android Application  
*(Final Year Project)*

---

## 📌 Project Status  

⚠ This project is currently **under development**.

Phase 1 (Core System) has been completed successfully.

The following modules are **currently in progress**:

- Performance analytics dashboard  
- Test history and archives  
- Edit existing tests  
- User profile management  
- Password reset functionality  

---

## 📖 Overview  

**ExamPro** is a full-stack web application designed to simplify the creation, management, and participation of online MCQ-based assessments.

The system allows educators to create scheduled, timed tests and share them via unique access codes. Students can attempt tests within a controlled environment and receive instant performance feedback.

### ✅ Currently Implemented (Phase 1)

#### 🔐 Authentication & Security
- Email-based registration system  
- 6-digit OTP verification using Gmail SMTP  
- BCrypt password hashing  
- Password strength validation  
- Secure login and logout session handling  

#### 📝 Test Creation (Educators)
- Create MCQ-based tests  
- Add unlimited questions  
- Set duration (in minutes)  
- Schedule activation date and time  
- Preview test before publishing  
- Auto-save draft using LocalStorage  
- Generate unique 8-character test codes  
- One-click code and link sharing  

#### ✍️ Test Taking (Students)
- Code-based test access  
- Countdown timer with visual warning indicators  
- Question navigation (Previous / Next)  
- Modify answers before submission  
- Auto-submit when time expires  
- One attempt per student restriction  
- Question progress tracking  

#### 📊 Results & Review
- Instant score calculation  
- Percentage-based performance display  
- Question-by-question review  
- Correct vs selected answer comparison  
- Color-coded feedback (Correct / Incorrect)  

---

## 🧠 Technologies Used  

### Backend

- Java 17  
- Spring Boot 3.2.5  
- Spring Security  
- Spring Data JPA  
- Hibernate ORM  
- MySQL 8.0  
- JavaMailSender (Gmail SMTP)  
- Maven  

Core Dependencies:

```xml
spring-boot-starter-web
spring-boot-starter-data-jpa
spring-boot-starter-security
spring-boot-starter-mail
mysql-connector-j
```

---

### Frontend

- HTML5  
- CSS3 (Custom styling, no frameworks)  
- Vanilla JavaScript (ES6+)  
- Font Awesome 6.4  
- LocalStorage API  

No React, Angular, Vue, Bootstrap, or Tailwind were used.  
The frontend is built entirely using core web technologies.

---

## 🗄 Database Design  

### Core Entities

- Users  
- Tests  
- Questions  
- TestResults  
- StudentAnswers  

### Relationship Summary

- A User can create multiple Tests  
- A Test contains multiple Questions  
- A User can attempt multiple Tests  
- Each TestResult stores selected answers and score  

### Tables Included

- `users`
- `tests`
- `questions`
- `test_results`
- `student_answers`

---

## 📡 API Endpoints  

Base URL:

```bash
http://localhost:8080/api
```

### 🔐 Authentication

- POST `/auth/register`
- POST `/auth/verify`
- POST `/auth/login`

### 📝 Test Management

- POST `/tests/create`
- GET `/tests/take/{code}`
- POST `/tests/submit`
- GET `/tests/check-attempt/{code}`

---

## ⚙ Installation Guide  

### 1️⃣ Install Requirements  

Make sure the following are installed:

- Java 17+
- MySQL 8+
- Maven 3.6+
- Git
- Gmail account (for SMTP email verification)

---

### 2️⃣ Clone Repository  

```bash
git clone https://github.com/yourusername/exampro.git
cd exampro
```

---

### 3️⃣ Create Database  

Login to MySQL:

```bash
mysql -u root -p
```

Then run:

```sql
CREATE DATABASE test_platform_db;
```

---

### 4️⃣ Configure Application  

Open:

```
backend/src/main/resources/application.properties
```

Update:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/test_platform_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.mail.username=your_email@gmail.com
spring.mail.password=YOUR_16_CHAR_APP_PASSWORD
```

---

### 5️⃣ Run Backend  

```bash
cd backend
mvn spring-boot:run
```

Server will start on:

```bash
http://localhost:8080
```

---

### 6️⃣ Run Frontend  

Using VS Code Live Server (recommended)  

OR  

```bash
cd frontend
python -m http.server 5500
```

Open:

```bash
http://localhost:5500
```

---

## 📌 Current Limitations  

- No performance analytics dashboard  
- No test editing functionality  
- No test history tracking  
- No password reset system  
- No mobile-optimized UI yet  
- Supports only MCQ (4-option format)  
- No deployment configuration included  

---

## 🎯 Future Scope  

- Performance analytics and insights dashboard  
- Test archives and history management  
- Editable assessments  
- Role-based access control  
- PDF / Excel export of results  
- Dark mode support  
- Mobile responsiveness improvements  
- AI-powered question generation  
- LMS integration  
- Cloud deployment  

---

## 👨‍💻 Developer  

**Sayandip Saha**  
B.Tech – Computer Science & Engineering  
St. Thomas’ College of Engineering and Technology  

GitHub: https://github.com/yourusername  
LinkedIn: https://www.linkedin.com/in/yourprofile  

---

⭐ If you found this project helpful, consider starring the repository.
