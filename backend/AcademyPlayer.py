from flask import request
from flask_restx import Resource, Namespace, fields
from models import AcademyPlayers
from flask_jwt_extended import jwt_required

# Namespace
academyPlayer_ns = Namespace(
    'academy/players', description="A namespace for our academy players"
)

# Model serializer for Swagger
academyPlayer_model = academyPlayer_ns.model(
    "AcademyPlayer", {
        "id": fields.Integer(),
        "name": fields.String(),
        "position": fields.String()
    }
)

# List route: /academy/players/
@academyPlayer_ns.route('/')
class AcademyPlayerListResource(Resource):
    @academyPlayer_ns.marshal_list_with(academyPlayer_model)
    def get(self):
        """Get all academy players"""
        return AcademyPlayers.query.all()

    @academyPlayer_ns.marshal_with(academyPlayer_model)
    @academyPlayer_ns.expect(academyPlayer_model)
    @jwt_required()
    @academyPlayer_ns.doc(security=[])
    def post(self):
        """Add a new academy player (JWT required)"""
        data = request.get_json()
        new_player = AcademyPlayers(
            name=data.get("name"),
            position=data.get("position")
        )
        new_player.save()
        return new_player, 201


# Detail route: /academy/players/<id>
@academyPlayer_ns.route('/<int:id>')
class AcademyPlayerResource(Resource):
    @academyPlayer_ns.marshal_with(academyPlayer_model)
    def get(self, id):
        """Get a single academy player by ID"""
        return AcademyPlayers.query.get_or_404(id)

    @jwt_required()
    @academyPlayer_ns.doc(security=[])
    def delete(self, id):
        """Delete an academy player by ID (JWT required)"""
        player = AcademyPlayers.query.get_or_404(id)
        player.delete()
        return {"message": "Player deleted successfully"}, 200