from flask import request, send_from_directory
from flask_restx import Resource, Namespace, fields
from models import News
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os

# Namespace
news_ns = Namespace('news', description="A namespace for news articles")

# Upload config
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Serve uploaded files
@news_ns.route('/uploads/<filename>')
class UploadedFileResource(Resource):
    def get(self, filename):
        """Serve uploaded news images"""
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(filepath):
            return send_from_directory(UPLOAD_FOLDER, filename)
        return {"message": "File not found"}, 404


# News model for Swagger
news_model = news_ns.model(
    "News", {
        "id": fields.Integer(),
        "title": fields.String(),
        "description": fields.String(),
        "image": fields.String(),
        "date": fields.String(),
    }
)


@news_ns.route('/')
class NewsListResource(Resource):
    @news_ns.marshal_list_with(news_model)
    def get(self):
        """Get all news articles"""
        return News.query.all()

    @news_ns.marshal_with(news_model)
    @jwt_required()
    @news_ns.doc(security=[])
    def post(self):
        """Create a new news article (JWT required)"""
        if 'image' not in request.files:
            return {"message": "Image file is required"}, 400

        image_file = request.files['image']
        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            image_file.save(os.path.join(UPLOAD_FOLDER, filename))
            image_url = f"uploads/{filename}"  # Relative URL
        else:
            return {"message": "Invalid image file type"}, 400

        title = request.form.get('title')
        description = request.form.get('description')
        date = request.form.get('date')

        if not title or not description or not date:
            return {"message": "Title, description, and date are required"}, 400

        new_news = News(
            title=title,
            description=description,
            image=image_url,
            date=date
        )
        new_news.save()
        return new_news, 201


@news_ns.route('/<int:id>')
class NewsResource(Resource):
    @news_ns.marshal_with(news_model)
    def get(self, id):
        """Get a single news article by ID"""
        return News.query.get_or_404(id)

    @jwt_required()
    @news_ns.doc(security=[])
    def delete(self, id):
        """Delete a news article by ID (JWT required)"""
        news_item = News.query.get_or_404(id)
        news_item.delete()
        return {"message": "News article deleted successfully"}, 200