# 📚 ExamPro - Online Assessment Platform
*(Full Stack Web Development Project)*

<div align="center">

[![Status](https://img.shields.io/badge/Status-Phase%201%20Complete-success?style=for-the-badge)](https://github.com/yourusername/exampro)
[![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**Create, Share, and Manage MCQ Tests with Ease**

[Features](#-currently-implemented-phase-1) • [Installation](#-complete-installation-guide) • [Tech Stack](#-technologies-used) • [Documentation](#-api-endpoints) • [Team](#-project-team)

</div>

---

## 📌 Project Status

> ⚠️ **This project is currently under development.**  
> **Phase 1 (Core System)** has been completed successfully.

### ✅ Completed Features
- User authentication with email verification
- Test creation with scheduling
- Test taking with timer
- Instant results and review
- Duplicate attempt prevention

### 🚧 In Progress (Phase 2)
- Performance analytics dashboard
- Test history and archives
- Edit existing tests
- User profile management
- Password reset functionality

---

## 📖 Overview

**ExamPro** is a full-stack web application designed to simplify the creation, management, and participation of online MCQ-based assessments. The system allows educators to create scheduled, timed tests and share them via unique access codes. Students can attempt tests within a controlled environment and receive instant performance feedback.

### 🎯 Key Highlights

- **For Educators:** Create unlimited MCQ tests, schedule activation times, and share via unique codes
- **For Students:** Take timed tests with live countdown and get instant results
- **Security:** Email verification, password encryption, one-attempt-per-student enforcement
- **Real-time:** Timer warnings, auto-submit, instant score calculation

---

## ✅ Currently Implemented (Phase 1)

### 🔐 Authentication & Security

| Feature | Description |
|---------|-------------|
| **Email Registration** | Email-based account creation system |
| **OTP Verification** | 6-digit verification code via Gmail SMTP |
| **Password Security** | BCrypt hashing with strength validation |
| **Session Management** | Secure login/logout with localStorage |

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&#)

---

### 📝 Test Creation (Educators)

✅ Create MCQ-based tests  
✅ Add unlimited questions with 4 options each  
✅ Set test duration (in minutes)  
✅ Schedule activation date and time  
✅ Preview test before publishing  
✅ Auto-save draft using LocalStorage  
✅ Generate unique 8-character test codes  
✅ One-click code and link sharing  

**Test Flow:**
1. Fill in test details (title, duration, schedule)
2. Add questions with 4 options (A, B, C, D)
3. Mark correct answer for each question
4. Preview and create
5. Share generated code with students

---

### ✍️ Test Taking (Students)

✅ Code-based test access  
✅ Countdown timer with visual warning indicators  
✅ Question navigation (Previous / Next)  
✅ Modify answers before submission  
✅ Auto-submit when time expires  
✅ One attempt per student restriction  
✅ Question progress tracking  

**Timer Warnings:**
- 🟢 **Normal:** White background
- 🟡 **Warning:** Orange at 5 minutes remaining
- 🔴 **Urgent:** Red with pulse effect at 1 minute

---

### 📊 Results & Review

✅ Instant score calculation  
✅ Percentage-based performance display  
✅ Question-by-question review  
✅ Correct vs selected answer comparison  
✅ Color-coded feedback (Green = Correct, Red = Incorrect)  

**Performance Messages:**
- 90-100%: "Outstanding! Excellent work! 🌟"
- 75-89%: "Great job! Well done! 👏"
- 60-74%: "Good effort! Keep it up! 💪"
- 40-59%: "Not bad! Room for improvement. 📚"
- Below 40%: "Keep practicing! You can do better! 💪"

---

## 🧠 Technologies Used

### Backend Stack

<table>
<tr>
<td width="50%">

**Core Technologies**
- **Java 17** - Programming Language
- **Spring Boot 3.2.5** - Application Framework
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Database ORM
- **Hibernate ORM** - Object-Relational Mapping
- **MySQL 8.0** - Relational Database
- **JavaMailSender** - Email Service (Gmail SMTP)
- **Maven** - Dependency Management

</td>
<td width="50%">

**Core Dependencies**
```xml
<dependencies>
  <dependency>
    spring-boot-starter-web
  </dependency>
  <dependency>
    spring-boot-starter-data-jpa
  </dependency>
  <dependency>
    spring-boot-starter-security
  </dependency>
  <dependency>
    spring-boot-starter-mail
  </dependency>
  <dependency>
    mysql-connector-j
  </dependency>
</dependencies>
```

</td>
</tr>
</table>

---

### Frontend Stack

**Pure Vanilla Web Technologies - No Frameworks Used**

| Technology | Purpose | Version |
|------------|---------|---------|
| HTML5 | Structure | Latest |
| CSS3 | Styling | Latest |
| JavaScript | Logic | ES6+ |
| Font Awesome | Icons | 6.4.0 |
| LocalStorage API | Client Storage | Native |

> **Note:** No React, Angular, Vue, Bootstrap, or Tailwind were used.  
> The frontend is built entirely using core web technologies for maximum simplicity and learning value.

---

## 🗄️ Database Design

### Entity Relationship Diagram
```
┌──────────────┐         ┌──────────────┐
│    USERS     │         │    TESTS     │
├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │
│ name         │         │ title        │
│ email (UK)   │◄────────┤ created_by   │
│ password     │         │ duration     │
│ verified     │         │ test_code(UK)│
│ verify_code  │         │ created_at   │
└──────────────┘         └──────┬───────┘
                                │
                                │ 1:N
                                │
                         ┌──────▼──────────┐
                         │   QUESTIONS     │
                         ├─────────────────┤
                         │ id (PK)         │
                         │ test_id (FK)    │
                         │ question_text   │
                         │ option_a        │
                         │ option_b        │
                         │ option_c        │
                         │ option_d        │
                         │ correct_answer  │
                         └─────────────────┘
                                │
                                │ N:M
                                │
                         ┌──────▼──────────────┐
                         │   TEST_RESULTS      │
                         ├─────────────────────┤
                         │ id (PK)             │
                         │ test_id (FK)        │
                         │ student_email       │
                         │ student_name        │
                         │ score               │
                         │ total_questions     │
                         │ submitted_at        │
                         └─────────────────────┘
                                │
                                │ 1:N
                                │
                         ┌──────▼─────────────────┐
                         │   STUDENT_ANSWERS      │
                         ├────────────────────────┤
                         │ result_id (FK)         │
                         │ question_id            │
                         │ selected_answer        │
                         └────────────────────────┘
```

### Core Entities

| Entity | Description |
|--------|-------------|
| **Users** | Stores educator/student account information |
| **Tests** | Contains test metadata (title, duration, schedule) |
| **Questions** | Individual MCQ questions with 4 options |
| **TestResults** | Student submission records and scores |
| **StudentAnswers** | Individual answer selections for each question |

### Key Relationships

- **One User** → **Many Tests** (One educator creates multiple tests)
- **One Test** → **Many Questions** (Each test has multiple questions)
- **One Test** → **Many Results** (Multiple students take each test)
- **One Result** → **Many Answers** (Each submission has answers for all questions)

---

## 📡 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/auth/register` | Create new account | `{ name, email, password }` |
| POST | `/auth/verify` | Verify email OTP | `{ email, code }` |
| POST | `/auth/login` | User login | `{ email, password }` |

**Example - Register:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:**
```
"VERIFICATION_SENT" | "EMAIL_ALREADY_EXISTS" | "WEAK_PASSWORD"
```

---

### 📝 Test Management Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| POST | `/tests/create` | Create new test | Request body with test details |
| GET | `/tests/take/{code}` | Load test for student | `code` (path), `email` (query) |
| POST | `/tests/submit` | Submit test answers | Request body with answers |
| GET | `/tests/check-attempt/{code}` | Check if already taken | `code` (path), `email` (query) |
| GET | `/tests/my-tests` | Get educator's tests | `email` (query) |

**Example - Create Test:**
```json
POST /api/tests/create
{
  "title": "Math Quiz Chapter 1",
  "duration": 30,
  "description": "Basic Algebra",
  "date": "2026-02-15",
  "time": "14:00",
  "createdBy": "educator@example.com",
  "questions": [
    {
      "text": "What is 2+2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": 1
    }
  ]
}
```

**Response:**
```json
{
  "status": "SUCCESS",
  "testCode": "ABC12XYZ",
  "testId": 1,
  "message": "Test created successfully"
}
```

---

## ⚙️ Complete Installation Guide

### 📋 Prerequisites

Before starting, ensure you have the following installed:

| Software | Version | Download Link | Verify Command |
|----------|---------|---------------|----------------|
| Java JDK | 17+ | [Download](https://www.oracle.com/java/technologies/downloads/) | `java -version` |
| MySQL | 8.0+ | [Download](https://dev.mysql.com/downloads/mysql/) | `mysql --version` |
| Maven | 3.6+ | [Download](https://maven.apache.org/download.cgi) | `mvn -version` |
| Git | Latest | [Download](https://git-scm.com/downloads) | `git --version` |
| Gmail Account | - | [Gmail](https://gmail.com) | For email verification |

**IDE/Editor (Choose One):**
- Visual Studio Code + Java Extension Pack + Spring Boot Extension
- IntelliJ IDEA Community Edition
- Eclipse IDE for Java Developers

**VS Code Extensions Required:**
- Live Server (for frontend)
- Extension Pack for Java
- Spring Boot Extension Pack

---

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/exampro.git
cd exampro
```

**Or download ZIP:**
1. Go to repository URL
2. Click "Code" → "Download ZIP"
3. Extract and navigate to folder

---

### 2️⃣ Setup MySQL Database

**Start MySQL Service:**

**Windows:**
```bash
net start MySQL80
```

**macOS:**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo systemctl start mysql
```

**Create Database:**
```bash
mysql -u root -p
```

Enter your MySQL password, then run:
```sql
CREATE DATABASE test_platform_db;
SHOW DATABASES;
exit;
```

✅ You should see `test_platform_db` in the list.

---

### 3️⃣ Configure Gmail SMTP

> **Why?** ExamPro sends verification codes via email during signup.

**Step A: Enable 2-Step Verification**

1. Visit: https://myaccount.google.com/security
2. Find "Signing in to Google"
3. Click "2-Step Verification"
4. Complete the setup process

**Step B: Generate App Password**

1. Visit: https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)**
4. Type: `ExamPro`
5. Click **Generate**
6. **Copy the 16-character password** (format: `xxxx xxxx xxxx xxxx`)
7. **Important:** Save it securely - you won't see it again!

---

### 4️⃣ Configure Application Properties

Navigate to:
```
backend/src/main/resources/application.properties
```

Update the following values:
```properties
# ================= DATABASE =================
spring.datasource.url=jdbc:mysql://localhost:3306/test_platform_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE

# ================= JPA / HIBERNATE =================
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# ================= EMAIL (GMAIL SMTP) =================
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=youremail@gmail.com
spring.mail.password=xxxxxxxxxxxxxxxx

spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Replace:**
- `YOUR_MYSQL_PASSWORD_HERE` → Your MySQL root password
- `youremail@gmail.com` → Your Gmail address
- `xxxxxxxxxxxxxxxx` → Your 16-char app password (remove all spaces)

**Example:**
```properties
spring.datasource.password=MyPass123
spring.mail.username=john.doe@gmail.com
spring.mail.password=abcdefghijklmnop
```

**Save the file** (Ctrl + S or Cmd + S)

---

### 5️⃣ Run Backend Server

Open terminal/command prompt in the `backend` folder:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**✅ Success Output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

Started BackendApplication in 3.456 seconds
Tomcat started on port(s): 8080 (http)
```

✅ **Backend is running!** Keep this terminal window open.

Server URL: `http://localhost:8080`

---

### 6️⃣ Run Frontend Application

**Option A: VS Code Live Server (Recommended)**

1. Open VS Code
2. Install "Live Server" extension
3. Open the `frontend` folder
4. Right-click on `index.html`
5. Select "Open with Live Server"
6. Browser automatically opens at `http://localhost:5500`

**Option B: Python HTTP Server**

Open a **NEW** terminal in the `frontend` folder:
```bash
cd frontend
python -m http.server 5500
```

Then open browser: `http://localhost:5500`

**Option C: Direct File Access**

Simply double-click `frontend/index.html`

⚠️ **Note:** Some features may not work due to CORS restrictions.

---

### 7️⃣ Test the Application

#### Create Your First Account

1. **Open:** http://localhost:5500
2. **Click:** "Sign Up" button
3. **Fill in:**
   - Name: `Test User`
   - Email: Your actual email address
   - Password: `Test1234!`
   - Confirm Password: `Test1234!`
4. **Click:** "Sign Up"
5. **Check your email** for 6-digit verification code
6. **Enter code** in verification popup
7. **Click:** "Verify"
8. **Success!** Login with your credentials

#### Create Your First Test

1. After login, click **"Create Assessment"**
2. Fill in:
   - **Title:** `My First Test`
   - **Duration:** `15` minutes
   - **Date:** Tomorrow's date
   - **Time:** Any time
   - **Description:** (Optional)
3. Click **"Add Question"**
4. Enter question:
   - **Question:** `What is 2 + 2?`
   - **Option A:** `3`
   - **Option B:** `4` ← Select as correct
   - **Option C:** `5`
   - **Option D:** `6`
5. Click **"Add Question"** in modal
6. Add more questions or click **"Create Test"**
7. **Copy the test code** (e.g., `ABC12XYZ`)

#### Take Your Test

1. Open new tab: http://localhost:5500/take-assessment.html
2. Enter the test code
3. Click **"Start Test"**
4. Fill in name and email
5. Click **"Begin Test"**
6. Answer questions
7. Click **"Submit Test"**
8. View instant results!

---

## 🐛 Troubleshooting

### ❌ Backend Issues

<details>
<summary><b>Problem: Port 8080 already in use</b></summary>

**Windows:**
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:8080 | xargs kill -9
```

Then restart backend.

</details>

<details>
<summary><b>Problem: Access denied for user 'root'@'localhost'</b></summary>

**Solution:**
- Check `spring.datasource.password` in `application.properties`
- Verify it matches your MySQL root password
- Test connection: `mysql -u root -p`

</details>

<details>
<summary><b>Problem: Email not sending</b></summary>

**Solution:**
1. Verify 2-Step Verification is enabled on Gmail
2. Generate a NEW app password
3. Copy correctly (remove all spaces)
4. Update `spring.mail.password` in config
5. Restart backend
6. Check console for SMTP errors

</details>

<details>
<summary><b>Problem: Table doesn't exist</b></summary>

**Solution:**
- Ensure `spring.jpa.hibernate.ddl-auto=update` in config
- Restart Spring Boot (tables auto-create)
- Check database: `SHOW TABLES;` in MySQL

</details>

---

### ❌ Frontend Issues

<details>
<summary><b>Problem: CORS error</b></summary>

**Solution:**
- Ensure controllers have `@CrossOrigin(origins = "*")`
- Use Live Server instead of opening HTML directly

</details>

<details>
<summary><b>Problem: Login modal not opening</b></summary>

**Solution:**
1. Press F12 (browser console)
2. Type: `localStorage.clear()`
3. Press Enter
4. Reload page (Ctrl + F5)

</details>

<details>
<summary><b>Problem: Cannot connect to backend</b></summary>

**Solution:**
- Check if backend is running (terminal should show "Tomcat started")
- Test: http://localhost:8080/api/tests/my-tests?email=test@test.com
- Should return `[]` or data

</details>

---

## 📂 Project Structure
```
exampro/
│
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/testplatform/backend/
│   │   ├── controller/              # REST Controllers
│   │   │   ├── AuthController.java
│   │   │   └── TestController.java
│   │   ├── entity/                  # JPA Entities
│   │   │   ├── User.java
│   │   │   ├── Test.java
│   │   │   ├── Question.java
│   │   │   └── TestResult.java
│   │   ├── repository/              # Data Repositories
│   │   │   ├── UserRepository.java
│   │   │   ├── TestRepository.java
│   │   │   ├── QuestionRepository.java
│   │   │   └── TestResultRepository.java
│   │   ├── service/                 # Business Logic
│   │   │   └── EmailService.java
│   │   ├── dto/                     # Data Transfer Objects
│   │   │   ├── VerifyRequest.java
│   │   │   ├── CreateTestRequest.java
│   │   │   ├── SubmitTestRequest.java
│   │   │   └── TestResponse.java
│   │   ├── util/                    # Utilities
│   │   │   └── TestCodeGenerator.java
│   │   ├── security/                # Security Config
│   │   │   └── SecurityConfig.java
│   │   └── BackendApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── frontend/                         # Vanilla JS Frontend
│   ├── index.html                   # Landing Page
│   ├── styles.css
│   ├── script.js
│   ├── home-logged-in.html          # Dashboard
│   ├── home-logged-in.css
│   ├── home-logged-in.js
│   ├── create-assessment.html       # Test Creation
│   ├── create-assessment.css
│   ├── create-assessment.js
│   ├── take-assessment.html         # Test Taking
│   ├── take-assessment.css
│   └── take-assessment.js
│
├── screenshots/                      # Project Screenshots
├── README.md
├── LICENSE
└── .gitignore
```

---

## 📌 Current Limitations

### What's NOT Implemented Yet

❌ Performance analytics dashboard  
❌ Test editing functionality  
❌ Test history tracking  
❌ Password reset system  
❌ Mobile-optimized UI  
❌ Multiple question types (only MCQ supported)  
❌ Deployment configuration  
❌ User profile management  
❌ Bulk result export (PDF/Excel)  

**These features are planned for Phase 2 development.**

---

## 🎯 Future Scope (Roadmap)

### Phase 2 (Q2 2026)
- [ ] Performance analytics and insights dashboard
- [ ] Test archives and history management
- [ ] Editable assessments
- [ ] User profile management
- [ ] Password reset functionality

### Phase 3 (Q3 2026)
- [ ] Role-based access control (Admin/Educator/Student)
- [ ] PDF / Excel export of results
- [ ] Dark mode support
- [ ] Mobile responsiveness improvements
- [ ] Test categories and tagging

### Phase 4 (Future)
- [ ] AI-powered question generation
- [ ] Different question types (True/False, Fill-in-blank)
- [ ] LMS integration (Moodle, Canvas)
- [ ] Real-time proctoring
- [ ] Cloud deployment (AWS/Azure)
- [ ] Multi-language support

---

## 👨‍💻 Project Team

<table>
<tr>
<td align="center">
<a href="https://www.linkedin.com/in/sayandip-saha-523ab430b/">
<img src="https://github.com/sayandipsaha.png" width="100px;" alt="Sayandip Saha"/><br />
<sub><b>Sayandip Saha</b></sub>
</a><br />
<sub>4th Year IT</sub><br/>
<sub>St. Thomas' College of Engineering and Technology</sub>
</td>
<td align="center">
<a href="https://www.linkedin.com/in/sristinil-biswas/">
<img src="https://github.com/sristinilbiswas.png" width="100px;" alt="Sristinil Biswas"/><br />
<sub><b>Sristinil Biswas</b></sub>
</a><br />
<sub>4th Year IT</sub><br/>
<sub>St. Thomas' College of Engineering and Technology</sub>
</td>
</tr>
</table>



## 📞 Contact & Support

### Connect With the Team

[![LinkedIn - Sayandip](https://img.shields.io/badge/LinkedIn-Sayandip%20Saha-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/sayandip-saha-523ab430b/)
[![LinkedIn - Sristinil](https://img.shields.io/badge/LinkedIn-Sristinil%20Biswas-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/sristinil-biswas/)

### Found a Bug?

---

## 🔖 Keywords

`online-assessment` `testing-platform` `mcq-test` `spring-boot` `java` `mysql` `javascript` `education-technology` `e-learning` `quiz-app` `exam-platform` `full-stack` `rest-api` `email-verification` `student-assessment` `final-year-project`

---

<div align="center">

### ⭐ If you found this project helpful, please consider starring the repository!

**Made with ❤️ by Sayandip Saha & Sristinil Biswas**

*Last Updated: February 2026 | Version 1.0.0 (Phase 1)*

[![GitHub stars](https://img.shields.io/github/stars/yourusername/exampro?style=social)](https://github.com/yourusername/exampro/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/exampro?style=social)](https://github.com/yourusername/exampro/network/members)

</div>
