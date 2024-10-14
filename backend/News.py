from flask import Flask, request, jsonify, send_from_directory
from flask_restx import Resource, Namespace, fields
from models import News
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os

# Namespace for News
news_ns = Namespace('news', description="A namespace for our news")

# Directory for storing uploaded files
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@news_ns.route('/uploads/<filename>')
class UploadedFileResource(Resource):
    def get(self, filename):
        """Serve uploaded files"""
        return send_from_directory(UPLOAD_FOLDER, filename)


# News model serializer
news_model = news_ns.model(
    "News", {
        "id": fields.Integer(),
        "title": fields.String(),
        "description": fields.String(),
        "image": fields.String(),
        "date": fields.String(),
    }
)


@news_ns.route('/news')
class NewsResource(Resource):
    @news_ns.marshal_list_with(news_model)
    def get(self):
        """Get all news articles"""
        news = News.query.all()
        return news

    @news_ns.marshal_with(news_model)
    @jwt_required()
    def post(self):
        """Create a new news article with image upload"""

        # Check if 'image' is part of the request files
        if 'image' not in request.files:
            return {"message": "Image file is required"}, 400

        image_file = request.files['image']

        # Validate and save the image
        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            image_file.save(file_path)
            image_url = f"/uploads/{filename}"  # Relative URL for serving
        else:
            return {"message": "Invalid image file type"}, 400

        # Collect form data
        title = request.form.get('title')
        description = request.form.get('description')
        date = request.form.get('date')

        # Validate form data
        if not title or not description or not date:
            return {"message": "Title, description, and date are required"}, 400

        # Save news entry
        new_news = News(
            title=title,
            description=description,
            image=image_url,  # Save image URL
            date=date
        )
        new_news.save()

        return new_news, 201


@news_ns.route('/news/<int:id>')
class NewsDetailResource(Resource):
    @news_ns.marshal_with(news_model)
    def get(self, id):
        """Get a single news article by ID"""
        news_item = News.query.get_or_404(id)
        return news_item

    @news_ns.marshal_with(news_model)
    @jwt_required()
    def delete(self, id):
        """Delete a news article by ID"""
        news_item_to_delete = News.query.get_or_404(id)
        news_item_to_delete.delete()
        return {"message": "News article deleted successfully"}, 200
