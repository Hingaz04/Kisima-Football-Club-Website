# auth.py
from flask_restx import Resource, Namespace, fields
from flask import request, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import User
from main import db 

auth_ns = Namespace('auth', description="Authentication operations")

signup_model = auth_ns.model(
    "SignUp", {
        "email": fields.String(),
        "password": fields.String(),
    }
)

login_model = auth_ns.model(
    "Login", {
        "email": fields.String(),
        "password": fields.String(),
    }
)

reset_admin_model = auth_ns.model(
    "ResetAdmin", {
        "email": fields.String(required=True, description="Admin email"),
        "new_password": fields.String(required=True, description="New password")
    }
)

# ---------------- SIGNUP ----------------
@auth_ns.route("/signup")
class Signup(Resource):
    @auth_ns.expect(signup_model)
    def post(self):
        data = request.get_json()
        email = data.get("email")
        db_user = User.query.filter_by(email=email).first()

        if db_user:
            return jsonify({"message": f'User email {email} already exists'})

        new_user = User(
            email=email,
            password=generate_password_hash(data.get("password"))
        )
        new_user.save()
        return jsonify({"message": 'User created successfully'})


# ---------------- LOGIN ----------------
@auth_ns.route("/login")
class Login(Resource):
    @auth_ns.expect(login_model)
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        db_user = User.query.filter_by(email=email).first()

        if db_user and check_password_hash(db_user.password, password):
            access_token = create_access_token(identity=db_user.email)
            refresh_token = create_refresh_token(identity=db_user.email)
            return jsonify({
                "access_token": access_token,
                "refresh_token": refresh_token
            })
        else:
            return jsonify({"message": "Invalid email or password"}), 401


# ---------------- REFRESH TOKEN ----------------
@auth_ns.route("/refresh")
class RefreshResource(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        return make_response(jsonify({"access_token": new_access_token}), 200)


