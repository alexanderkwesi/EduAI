-- ============================================
-- EduAI Database Schema
-- Database: aischolars
-- ============================================

USE DATABASE aischolars;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,  -- UUID as string
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    subscription_plan VARCHAR(50),  -- 'teacher', 'video', 'ai'
    subscription_active BOOLEAN DEFAULT FALSE,
    subscription_started_at TIMESTAMP,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- Indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_active ON users(subscription_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================
-- 2. SESSIONS TABLE
-- ============================================
CREATE TABLE sessions (
    token VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 7 DAY),
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for sessions
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_token ON sessions(token);

-- ============================================
-- 3. SYLLABUS / CURRICULUM TABLES
-- ============================================

-- Syllabus types (cambridge, kaplan, etc.)
CREATE TABLE syllabi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    syllabus_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (syllabus_id) REFERENCES syllabi(id) ON DELETE CASCADE,
    UNIQUE KEY unique_subject_syllabus (syllabus_id, name)
);

-- Levels
CREATE TABLE levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_level_subject (subject_id, name)
);

-- Topics
CREATE TABLE topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    estimated_hours DECIMAL(5,2) DEFAULT 3.0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
    UNIQUE KEY unique_topic_level (level_id, name)
);

-- ============================================
-- 4. LEARNING PLANS TABLE
-- ============================================
CREATE TABLE learning_plans (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    syllabus_id INT,
    subject_id INT,
    level_id INT,
    subject_name VARCHAR(100) NOT NULL,
    level_name VARCHAR(50) NOT NULL,
    syllabus_name VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    progress_percent DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (syllabus_id) REFERENCES syllabi(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (level_id) REFERENCES levels(id)
);

-- Indexes for learning_plans
CREATE INDEX idx_learning_plans_user_id ON learning_plans(user_id);
CREATE INDEX idx_learning_plans_status ON learning_plans(status);
CREATE INDEX idx_learning_plans_created_at ON learning_plans(created_at);

-- ============================================
-- 5. PLAN TOPICS (roadmap items)
-- ============================================
CREATE TABLE plan_topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id VARCHAR(36) NOT NULL,
    topic_id INT,
    topic_name VARCHAR(200) NOT NULL,
    week_number INT NOT NULL,
    estimated_hours DECIMAL(5,2) DEFAULT 3.0,
    status VARCHAR(20) DEFAULT 'upcoming',
    completed_at TIMESTAMP,
    notes TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES learning_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL
);

-- Indexes for plan_topics
CREATE INDEX idx_plan_topics_plan_id ON plan_topics(plan_id);
CREATE INDEX idx_plan_topics_status ON plan_topics(status);
CREATE INDEX idx_plan_topics_week ON plan_topics(plan_id, week_number);

-- ============================================
-- 6. SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'GBP',
    status VARCHAR(20) DEFAULT 'active',
    gocardless_mandate_id VARCHAR(255),
    gocardless_subscription_id VARCHAR(255),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for subscriptions
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_expires_at ON subscriptions(expires_at);

-- ============================================
-- 7. PAYMENT TRANSACTIONS TABLE
-- ============================================
CREATE TABLE payment_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    subscription_id INT,
    gocardless_payment_id VARCHAR(255) UNIQUE,
    gocardless_billing_request_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'GBP',
    status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50),
    paid_at TIMESTAMP,
    failure_reason TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
);

-- Indexes for payment_transactions
CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_gocardless_id ON payment_transactions(gocardless_payment_id);

-- ============================================
-- 8. PRICING TABLE
-- ============================================
CREATE TABLE pricing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id VARCHAR(50) NOT NULL UNIQUE,
    plan_name VARCHAR(100) NOT NULL,
    monthly_price DECIMAL(10,2) NOT NULL,
    annual_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'GBP',
    features JSON,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 9. AUDIT LOGS TABLE
-- ============================================
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(255),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for audit_logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- 10. USER ACTIVITY TABLE
-- ============================================
CREATE TABLE user_activity (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    plan_id VARCHAR(36),
    topic_id INT,
    metadata JSON,
    duration_seconds INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES learning_plans(id) ON DELETE SET NULL,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL
);

-- Indexes for user_activity
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX idx_user_activity_created_at ON user_activity(created_at);

-- ============================================
-- 11. STUDY SESSIONS TABLE (for tracking learning time)
-- ============================================
CREATE TABLE study_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    plan_id VARCHAR(36),
    topic_id INT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    duration_seconds INT,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES learning_plans(id) ON DELETE SET NULL,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL
);

CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX idx_study_sessions_started_at ON study_sessions(started_at);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert syllabi
INSERT INTO syllabi (name, display_name) VALUES 
('cambridge', 'Cambridge International'),
('kaplan', 'Kaplan Test Prep');

-- Insert pricing data
INSERT INTO pricing (plan_id, plan_name, monthly_price, annual_price, features) VALUES
('teacher', 'Teacher-Led', 599, 479, '["Live sessions", "Personal tutor", "Homework grading"]'),
('video', 'Video Learning', 599, 479, '["On-demand videos", "Practice quizzes", "Progress tracking"]'),
('ai', 'AI-Powered', 599, 479, '["Adaptive learning", "AI tutor", "Personalized roadmap"]');

-- Insert Cambridge subjects
INSERT INTO subjects (syllabus_id, name, display_name, icon) VALUES
(1, 'Mathematics', 'Mathematics', '📐'),
(1, 'Physics', 'Physics', '⚡'),
(1, 'Chemistry', 'Chemistry', '🧪'),
(1, 'Biology', 'Biology', '🌿'),
(1, 'Economics', 'Economics', '📊');

-- Insert Kaplan subjects
INSERT INTO subjects (syllabus_id, name, display_name, icon) VALUES
(2, 'GMAT', 'GMAT', '📋'),
(2, 'GRE', 'GRE', '✏️'),
(2, 'LSAT', 'LSAT', '⚖️');

-- Insert levels and topics for Cambridge Mathematics
INSERT INTO levels (subject_id, name, display_name) VALUES
(1, 'IGCSE', 'IGCSE'),
(1, 'A-Level', 'A-Level');

-- Insert topics for Mathematics IGCSE
SET @math_igcse_level_id = (SELECT id FROM levels WHERE subject_id = 1 AND name = 'IGCSE');
INSERT INTO topics (level_id, name, display_name, estimated_hours, sort_order) VALUES
(@math_igcse_level_id, 'Number & Algebra', 'Number & Algebra', 4, 1),
(@math_igcse_level_id, 'Geometry', 'Geometry', 3, 2),
(@math_igcse_level_id, 'Statistics', 'Statistics', 3, 3),
(@math_igcse_level_id, 'Trigonometry', 'Trigonometry', 4, 4);

-- Insert topics for Mathematics A-Level
SET @math_alevel_level_id = (SELECT id FROM levels WHERE subject_id = 1 AND name = 'A-Level');
INSERT INTO topics (level_id, name, display_name, estimated_hours, sort_order) VALUES
(@math_alevel_level_id, 'Pure Maths', 'Pure Maths', 5, 1),
(@math_alevel_level_id, 'Mechanics', 'Mechanics', 4, 2),
(@math_alevel_level_id, 'Statistics', 'Statistics', 4, 3),
(@math_alevel_level_id, 'Calculus', 'Calculus', 5, 4);

-- Insert levels for Physics
INSERT INTO levels (subject_id, name, display_name) VALUES
(2, 'IGCSE', 'IGCSE'),
(2, 'A-Level', 'A-Level');

-- Insert topics for Physics IGCSE
SET @physics_igcse_level_id = (SELECT id FROM levels WHERE subject_id = 2 AND name = 'IGCSE');
INSERT INTO topics (level_id, name, display_name, estimated_hours, sort_order) VALUES
(@physics_igcse_level_id, 'Motion', 'Motion', 3, 1),
(@physics_igcse_level_id, 'Energy', 'Energy', 3, 2),
(@physics_igcse_level_id, 'Waves', 'Waves', 4, 3),
(@physics_igcse_level_id, 'Electricity', 'Electricity', 4, 4);

-- Insert topics for Physics A-Level
SET @physics_alevel_level_id = (SELECT id FROM levels WHERE subject_id = 2 AND name = 'A-Level');
INSERT INTO topics (level_id, name, display_name, estimated_hours, sort_order) VALUES
(@physics_alevel_level_id, 'Quantum', 'Quantum Physics', 5, 1),
(@physics_alevel_level_id, 'Mechanics', 'Advanced Mechanics', 5, 2),
(@physics_alevel_level_id, 'Thermal', 'Thermal Physics', 4, 3),
(@physics_alevel_level_id, 'Fields', 'Electric & Magnetic Fields', 5, 4);

-- Insert levels for Chemistry
INSERT INTO levels (subject_id, name, display_name) VALUES
(3, 'IGCSE', 'IGCSE'),
(3, 'A-Level', 'A-Level');

-- Insert topics for Chemistry IGCSE
SET @chem_igcse_level_id = (SELECT id FROM levels WHERE subject_id = 3 AND name = 'IGCSE');
INSERT INTO topics (level_id, name, display_name, estimated_hours, sort_order) VALUES
(@chem_igcse_level_id, 'Atomic Structure', 'Atomic Structure', 3, 1),
(@chem_igcse_level_id, 'Bonding', 'Chemical Bonding', 4, 2),
(@chem_igcse_level_id, 'Acids', 'Acids and Bases', 3, 3),
(@chem_igcse_level_id, 'Organic Basics', 'Organic Chemistry Basics', 4, 4);

-- Insert topics for Chemistry A-Level
SET @chem_alevel_level_id = (SELECT id FROM levels WHERE subject_id = 3 AND name = 'A-Level');
INSERT INTO topics (level_id, name, display_name, estimated_hours, sort_order) VALUES
(@chem_alevel_level_id, 'Equilibria', 'Chemical Equilibria', 5, 1),
(@chem_alevel_level_id, 'Kinetics', 'Reaction Kinetics', 4, 2),
(@chem_alevel_level_id, 'Electrochemistry', 'Electrochemistry', 5, 3),
(@chem_alevel_level_id, 'Organic Synthesis', 'Organic Synthesis', 6, 4);

-- Insert levels for Biology
INSERT INTO levels (subject_id, name, display_name) VALUES
(4, 'IGCSE', 'IGCSE'),
(4, 'A-Level', 'A-Level');

-- Insert levels for Economics
INSERT INTO levels (subject_id, name, display_name) VALUES
(5, 'IGCSE', 'IGCSE'),
(5, 'A-Level', 'A-Level');

-- Insert levels for Kaplan subjects
INSERT INTO levels (subject_id, name, display_name) VALUES
(6, 'Foundation', 'Foundation'),  -- GMAT
(6, 'Advanced', 'Advanced'),
(7, 'Foundation', 'Foundation'),  -- GRE
(7, 'Advanced', 'Advanced'),
(8, 'Foundation', 'Foundation'),  -- LSAT
(8, 'Advanced', 'Advanced');

-- ============================================
-- VIEWS
-- ============================================

-- Active user sessions view
CREATE VIEW active_sessions_view AS
SELECT s.token, u.id as user_id, u.email, u.first_name, u.last_name, s.created_at
FROM sessions s
JOIN users u ON s.user_id = u.id
WHERE s.expires_at > NOW();

-- User subscription status view
CREATE VIEW user_subscription_status_view AS
SELECT 
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    s.plan_type,
    s.status as subscription_status,
    s.started_at,
    s.expires_at,
    CASE 
        WHEN s.expires_at > NOW() AND s.status = 'active' THEN TRUE
        ELSE FALSE
    END as is_active
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
WHERE s.id IS NULL OR s.id = (SELECT id FROM subscriptions s2 WHERE s2.user_id = u.id ORDER BY started_at DESC LIMIT 1);

-- ============================================
-- STORED PROCEDURES
-- ============================================

-- Procedure to clean expired sessions
DELIMITER //
CREATE PROCEDURE clean_expired_sessions()
BEGIN
    DELETE FROM sessions WHERE expires_at < NOW();
    SELECT ROW_COUNT() as deleted_count;
END //
DELIMITER ;

-- Procedure to get user learning progress
DELIMITER //
CREATE PROCEDURE get_user_progress(IN p_user_id VARCHAR(36))
BEGIN
    SELECT 
        lp.id as plan_id,
        lp.subject_name,
        lp.level_name,
        lp.progress_percent,
        COUNT(pt.id) as total_topics,
        SUM(CASE WHEN pt.status = 'completed' THEN 1 ELSE 0 END) as completed_topics
    FROM learning_plans lp
    LEFT JOIN plan_topics pt ON lp.id = pt.plan_id
    WHERE lp.user_id = p_user_id AND lp.status = 'active'
    GROUP BY lp.id, lp.subject_name, lp.level_name, lp.progress_percent;
END //
DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp trigger
DELIMITER //
CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users
FOR EACH ROW
SET NEW.updated_at = CURRENT_TIMESTAMP//
DELIMITER ;

DELIMITER //
CREATE TRIGGER update_learning_plans_updated_at 
BEFORE UPDATE ON learning_plans
FOR EACH ROW
SET NEW.updated_at = CURRENT_TIMESTAMP//
DELIMITER ;

DELIMITER //
CREATE TRIGGER update_subscriptions_updated_at 
BEFORE UPDATE ON subscriptions
FOR EACH ROW
SET NEW.updated_at = CURRENT_TIMESTAMP//
DELIMITER ;

-- ============================================
-- MIGRATION SCRIPT (from in-memory data)
-- ============================================

/*
-- Run this after creating the schema to migrate existing data

-- Insert existing users
INSERT INTO users (id, first_name, last_name, email, password_hash, 
                   subscription_plan, subscription_active, is_demo, created_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?));

-- Insert existing sessions
INSERT INTO sessions (token, user_id, created_at, expires_at)
VALUES (?, ?, FROM_UNIXTIME(?), DATE_ADD(FROM_UNIXTIME(?), INTERVAL 7 DAY));

-- Insert existing learning plans
INSERT INTO learning_plans (id, user_id, subject_name, level_name, syllabus_name, created_at)
VALUES (?, ?, ?, ?, ?, FROM_UNIXTIME(?));
*/