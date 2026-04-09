from flask import request, send_from_directory
from flask_restx import Resource, Namespace, fields
from models import AcademyNews
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os

# Namespace
academyNews_ns = Namespace(
    'academy/news', description="A namespace for our academy news"
)

# Directory for uploaded files
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Ensure upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Serializer / Swagger model
academyNews_model = academyNews_ns.model(
    "AcademyNews", {
        "id": fields.Integer(),
        "title": fields.String(),
        "description": fields.String(),
        "image": fields.String(),
        "date": fields.String(),
    }
)


# List route: /academy/news/
@academyNews_ns.route('/')
class AcademyNewsListResource(Resource):
    @academyNews_ns.marshal_list_with(academyNews_model)
    def get(self):
        """Get all academy news articles"""
        return AcademyNews.query.all()

    @academyNews_ns.marshal_with(academyNews_model)
    @jwt_required()
    def post(self):
        """Create a new academy news article with image upload"""
        if 'image' not in request.files:
            return {"message": "Image file is required"}, 400

        image_file = request.files['image']

        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            image_file.save(os.path.join(UPLOAD_FOLDER, filename))
            image_url = f"/uploads/{filename}"
        else:
            return {"message": "Invalid image file type"}, 400

        title = request.form.get('title')
        description = request.form.get('description')
        date = request.form.get('date')

        if not title or not description or not date:
            return {"message": "Title, description, and date are required"}, 400

        new_news = AcademyNews(
            title=title,
            description=description,
            image=image_url,
            date=date
        )
        new_news.save()
        return new_news, 201


# Detail route: /academy/news/<id>
@academyNews_ns.route('/<int:id>')
class AcademyNewsResource(Resource):
    @academyNews_ns.marshal_with(academyNews_model)
    def get(self, id):
        """Get a single academy news article by ID"""
        return AcademyNews.query.get_or_404(id)

    @jwt_required()
    def delete(self, id):
        """Delete an academy news article by ID"""
        news_item = AcademyNews.query.get_or_404(id)
        news_item.delete()
        return {"message": "News article deleted successfully"}, 200


# Serve uploaded files
@academyNews_ns.route('/uploads/<filename>')
class UploadedFileResource(Resource):
    def get(self, filename):
        """Serve uploaded files"""
        return send_from_directory(UPLOAD_FOLDER, filename)