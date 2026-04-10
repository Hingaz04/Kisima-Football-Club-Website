from flask import request, send_from_directory
from flask_restx import Resource, Namespace, fields
from models import AcademyNews
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os

academyNews_ns = Namespace(
    'academy/news',
    description="Academy News Namespace"
)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


academyNews_model = academyNews_ns.model(
    "AcademyNews",
    {
        "id": fields.Integer(),
        "title": fields.String(),
        "description": fields.String(),
        "image": fields.String(),
        "date": fields.String(),
    },
)

# ================= LIST + CREATE =================
@academyNews_ns.route("/")
class AcademyNewsList(Resource):

    @academyNews_ns.marshal_list_with(academyNews_model)
    def get(self):
        return AcademyNews.query.all()

    @jwt_required()
    def post(self):
        if "image" not in request.files:
            return {"message": "Image required"}, 400

        image_file = request.files["image"]

        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            image_file.save(os.path.join(UPLOAD_FOLDER, filename))
            image_url = f"/academy/news/uploads/{filename}"
        else:
            return {"message": "Invalid image"}, 400

        title = request.form.get("title")
        description = request.form.get("description")
        date = request.form.get("date")

        if not title or not description or not date:
            return {"message": "Missing fields"}, 400

        news = AcademyNews(
            title=title,
            description=description,
            image=image_url,
            date=date,
        )

        news.save()
        return news, 201


# ================= SINGLE + DELETE =================
@academyNews_ns.route("/<int:id>")
class AcademyNewsResource(Resource):

    def get(self, id):
        return AcademyNews.query.get_or_404(id)

    @jwt_required()
    def delete(self, id):
        item = AcademyNews.query.get_or_404(id)
        item.delete()
        return {"message": "Deleted"}, 200


# ================= SERVE IMAGES =================
@academyNews_ns.route("/uploads/<filename>")
class UploadedFile(Resource):

    def get(self, filename):
        return send_from_directory(UPLOAD_FOLDER, filename)