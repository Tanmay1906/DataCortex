from app import create_app
from app.models.user import User
from app.models.case import Case
from app.models.evidence import Evidence
from app import db
import os

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'User': User,
        'Case': Case,
        'Evidence': Evidence
    }

if __name__ == '__main__':
    app.run(debug=True)