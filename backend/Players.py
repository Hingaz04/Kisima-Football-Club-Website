from flask import request
from flask_restx import Resource, Namespace, fields
from models import Player
from flask_jwt_extended import jwt_required

player_ns = Namespace('players', description="A namespace for our players")

player_model = player_ns.model(
    "Player", {
        "id": fields.Integer(),
        "name": fields.String(),
        "position": fields.String()
    }
)

@player_ns.route('/')
class PlayerListResource(Resource):
    @player_ns.marshal_list_with(player_model)
    def get(self):
        """Get all players"""
        return Player.query.all()

    @player_ns.marshal_with(player_model)
    @player_ns.expect(player_model)
    @jwt_required()
    @player_ns.doc(security=[])
    def post(self):
        """Add a new player (JWT required)"""
        data = request.get_json()
        player = Player(name=data.get("name"), position=data.get("position"))
        player.save()
        return player, 201

@player_ns.route('/<int:id>')
class PlayerResource(Resource):
    @player_ns.marshal_with(player_model)
    def get(self, id):
        """Get player by ID"""
        return Player.query.get_or_404(id)

    @jwt_required()
    @player_ns.doc(security=[])
    def delete(self, id):
        """Delete a player (JWT required)"""
        player = Player.query.get_or_404(id)
        player.delete()
        return {"message": "Player deleted successfully"}, 200