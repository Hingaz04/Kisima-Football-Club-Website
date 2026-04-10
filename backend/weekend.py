from flask import request, send_from_directory
from flask_restx import Resource, Namespace, fields
from models import Weekend
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os

weekend_ns = Namespace('weekend', description="Weekend events")

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# -------------------------
# GLOBAL IMAGE SERVING (IMPORTANT FIX)
# -------------------------
from flask import Flask

def register_upload_route(app):
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(UPLOAD_FOLDER, filename)


# -------------------------
# MODEL
# -------------------------
weekend_model = weekend_ns.model(
    "Weekend",
    {
        "id": fields.Integer(),
        "weekendImages": fields.String(),
        "date": fields.String(),
    }
)


# -------------------------
# LIST + CREATE
# -------------------------
@weekend_ns.route('/')
class WeekendListResource(Resource):

    @weekend_ns.marshal_list_with(weekend_model)
    def get(self):
        return Weekend.query.all()

    @jwt_required()
    @weekend_ns.marshal_with(weekend_model)
    def post(self):

        if 'weekendImages' not in request.files:
            return {"message": "Image required"}, 400

        image = request.files['weekendImages']
        date = request.form.get('date')

        if not image or not allowed_file(image.filename):
            return {"message": "Invalid image"}, 400

        filename = secure_filename(image.filename)
        image.save(os.path.join(UPLOAD_FOLDER, filename))

        new_weekend = Weekend(
            weekendImages=f"uploads/{filename}",
            date=date
        )

        new_weekend.save()
        return new_weekend, 201


# -------------------------
# SINGLE ITEM
# -------------------------
@weekend_ns.route('/<int:id>')
class WeekendResource(Resource):

    def get(self, id):
        return Weekend.query.get_or_404(id)

    @jwt_required()
    def delete(self, id):
        item = Weekend.query.get_or_404(id)
        item.delete()
        return {"message": "Deleted"}, 200