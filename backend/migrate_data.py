
# migrate_data.py
"""
Run this script to migrate from your in-memory dicts to the new database.
"""

import asyncpg
import json
from main import USERS, PLANS, SESSIONS

async def migrate():
    conn = await asyncpg.connect(
        host='localhost',
        database='eduaidb',
        user='postgres',
        password='yourpassword'
    )
    
    # Migrate users
    for user_id, user_data in USERS.items():
        await conn.execute("""
            INSERT INTO users (id, first_name, last_name, email, password_hash, 
                              subscription_plan, subscription_active, is_demo, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, to_timestamp($9))
            ON CONFLICT (id) DO NOTHING
        """, user_id, user_data['first_name'], user_data['last_name'],
            user_data['email'], user_data['password'],
            user_data.get('subscription', {}).get('plan'),
            user_data.get('subscription', {}).get('active', False),
            user_id == 'demo-user',
            user_data.get('created', 0))
    
    # Migrate sessions
    for token, session in SESSIONS.items():
        await conn.execute("""
            INSERT INTO sessions (token, user_id, created_at)
            VALUES ($1, $2, to_timestamp($3))
            ON CONFLICT (token) DO NOTHING
        """, token, session['user_id'], session.get('created', 0))
    
    # Migrate learning plans
    for plan_id, plan in PLANS.items():
        await conn.execute("""
            INSERT INTO learning_plans (id, user_id, subject_name, level_name, 
                                        syllabus_name, created_at)
            VALUES ($1, $2, $3, $4, $5, to_timestamp($6))
        """, plan_id, plan['user_id'], plan['subject'], 
            plan['level'], plan['syllabus'], plan.get('created', 0))
        
        # Insert plan topics
        for topic in plan.get('roadmap', []):
            await conn.execute("""
                INSERT INTO plan_topics (plan_id, topic_name, week_number, 
                                         estimated_hours, status)
                VALUES ($1, $2, $3, $4, $5)
            """, plan_id, topic['topic'], topic['week'], 
                topic.get('hrs', 3), topic.get('status', 'upcoming'))
    
    await conn.close()

# Run with: python -c "import asyncio; from migrate_data import migrate; asyncio.run(migrate())"