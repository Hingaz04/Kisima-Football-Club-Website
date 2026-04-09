from flask import request, send_from_directory
from flask_restx import Resource, Namespace, fields
from models import Weekend
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os

# Namespace
weekend_ns = Namespace('weekend', description="A namespace for weekend events")

# Upload config
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Serve uploaded files
@weekend_ns.route('/uploads/<filename>')
class UploadedFileResource(Resource):
    def get(self, filename):
        """Serve uploaded weekend images"""
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(filepath):
            return send_from_directory(UPLOAD_FOLDER, filename)
        return {"message": "File not found"}, 404


# Weekend model for Swagger
weekend_model = weekend_ns.model(
    "Weekend", {
        "id": fields.Integer(),
        "weekendImages": fields.String(),
        "date": fields.String(),
    }
)


@weekend_ns.route('/')
class WeekendListResource(Resource):
    @weekend_ns.marshal_list_with(weekend_model)
    def get(self):
        """Get all weekends"""
        return Weekend.query.all()

    @weekend_ns.marshal_with(weekend_model)
    @jwt_required()
    @weekend_ns.doc(security=[])
    def post(self):
        """Create a new weekend (JWT required)"""
        if 'weekendImages' not in request.files:
            return {"message": "Weekend image is required"}, 400

        weekend_image = request.files['weekendImages']
        date = request.form.get('date')

        # Validate and save image
        if weekend_image and allowed_file(weekend_image.filename):
            filename = secure_filename(weekend_image.filename)
            weekend_image.save(os.path.join(UPLOAD_FOLDER, filename))
        else:
            return {"message": "Invalid file for weekend image"}, 400

        new_weekend = Weekend(
            weekendImages=f"uploads/{filename}",
            date=date
        )
        new_weekend.save()
        return new_weekend, 201


@weekend_ns.route('/<int:id>')
class WeekendResource(Resource):
    @weekend_ns.marshal_with(weekend_model)
    def get(self, id):
        """Get a single weekend by ID"""
        return Weekend.query.get_or_404(id)

    @jwt_required()
    @weekend_ns.doc(security=[])
    def delete(self, id):
        """Delete a weekend by ID (JWT required)"""
        weekend = Weekend.query.get_or_404(id)
        weekend.delete()
        return {"message": "Weekend deleted successfully"}, 200