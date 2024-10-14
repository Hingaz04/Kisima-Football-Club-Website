from flask import Flask, request, jsonify, send_from_directory
from flask_restx import Resource, Namespace, fields
from models import Weekend
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os

# Namespace for Weekend
weekend_ns = Namespace('weekend', description="A namespace for our weekends")

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Serve static files (images) from the uploads folder
@weekend_ns.route('/uploads/<filename>')
class UploadedFileResource(Resource):
    def get(self, filename):
        """Serve uploaded files"""
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(filepath):
            return send_from_directory(UPLOAD_FOLDER, filename)
        else:
            return {"message": "File not found"}, 404

# Function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Weekend model serializer
weekend_model = weekend_ns.model(
    "Weekend", {
        "id": fields.Integer(),
        "weekendImages": fields.String(),  
        "date": fields.String(),           
    }
)

@weekend_ns.route('/weekends')
class WeekendResource(Resource):
    @weekend_ns.marshal_list_with(weekend_model)
    def get(self):
        """Get all weekends"""
        weekends = Weekend.query.all()
        return weekends

    @weekend_ns.marshal_with(weekend_model)
    @jwt_required()
    def post(self):
        """Create a new weekend with image upload"""

        if 'weekendImages' not in request.files:
            return {"message": "Weekend image is required"}, 400

        weekend_image = request.files['weekendImages']
        date = request.form.get('date')

        # Validate and save image
        if weekend_image and allowed_file(weekend_image.filename):
            weekend_filename = secure_filename(weekend_image.filename)
            weekend_image_path = os.path.join(UPLOAD_FOLDER, weekend_filename)
            weekend_image.save(weekend_image_path)
        else:
            return {"message": "Invalid file for weekend image"}, 400

        # Save weekend data with relative image path
        new_weekend = Weekend(
            weekendImages=f"uploads/{weekend_filename}",
            date=date
        )
        new_weekend.save()

        return new_weekend, 201

@weekend_ns.route('/weekend/<int:id>')
class WeekendDetailResource(Resource):
    @weekend_ns.marshal_with(weekend_model)
    def get(self, id):
        """Get a single weekend by ID"""
        weekend = Weekend.query.get_or_404(id)
        return weekend

    @weekend_ns.marshal_with(weekend_model)
    @jwt_required()
    def delete(self, id):
        """Delete a weekend by ID"""
        weekend_to_delete = Weekend.query.get_or_404(id)
        weekend_to_delete.delete()
        return {"message": "Weekend deleted successfully"}, 200
