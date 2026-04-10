from flask import request
from flask_restx import Resource, Namespace, fields
from models import Player
from flask_jwt_extended import jwt_required

player_ns = Namespace('players', description="Players operations")

# --------------------
# MODEL
# --------------------
player_model = player_ns.model(
    "Player",
    {
        "id": fields.Integer(),
        "name": fields.String(required=True),
        "position": fields.String(required=True),
    },
)

# --------------------
# LIST + CREATE
# --------------------
@player_ns.route('/')
class PlayerListResource(Resource):

    @player_ns.marshal_list_with(player_model)
    def get(self):
        """Get all players"""
        return Player.query.all()

    @jwt_required()
    @player_ns.marshal_with(player_model)
    def post(self):
        """Create player"""

        data = request.get_json()

        if not data.get("name") or not data.get("position"):
            return {"message": "Name and position required"}, 400

        player = Player(
            name=data["name"],
            position=data["position"]
        )

        player.save()
        return player, 201


# --------------------
# SINGLE PLAYER
# --------------------
@player_ns.route('/<int:id>')
class PlayerResource(Resource):

    def get(self, id):
        """Get player by ID"""
        return Player.query.get_or_404(id)

    @jwt_required()
    def delete(self, id):
        """Delete player"""
        player = Player.query.get_or_404(id)
        player.delete()
        return {"message": "Player deleted successfully"}, 200