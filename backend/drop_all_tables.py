from main import app, db
from sqlalchemy import text

with app.app_context():
    # Get all table names
    result = db.session.execute(text("SHOW TABLES"))
    tables = result.fetchall()
    
    # Drop each table
    for table in tables:
        table_name = table[0]
        try:
            db.session.execute(text(f"DROP TABLE IF EXISTS `{table_name}`"))
            print(f"✅ Dropped table: {table_name}")
        except Exception as e:
            print(f"❌ Failed to drop {table_name}: {e}")
    
    db.session.commit()
    print("\n🎉 All tables dropped successfully!")
