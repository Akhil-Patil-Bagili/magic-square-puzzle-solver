from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from marshmallow import fields, validates_schema, ValidationError
import re
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
ma = Marshmallow(app)  

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

# Marshmallow Schemas
class UserSchema(ma.Schema):
    username = fields.Email(required=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    password = fields.Str(required=True, validate=lambda p: len(p) >= 6)

class SignInSchema(ma.Schema):
    username = fields.Email(required=True)
    password = fields.Str(required=True)

# Utility Functions
def validate_user_input(data):
    schema = UserSchema()
    errors = schema.validate(data)
    if errors:
        return False, errors
    return True, ""

# Routes
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    valid, message = validate_user_input(data)
    if not valid:
        return jsonify({"error": message}), 400

    username = data['username']
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    password_hash = generate_password_hash(data['password'])
    new_user = User(first_name=data['first_name'], last_name=data['last_name'], username=username, password_hash=password_hash)
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=username)
    return jsonify({"message": "User created successfully", "access_token": access_token}), 201

@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    schema = SignInSchema()
    errors = schema.validate(data)
    if errors:
        return jsonify({"error": errors}), 400

    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity=data['username'])
        return jsonify({"message": "Authentication successful", "access_token": access_token}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = {"username": user.username, "first_name": user.first_name, "last_name": user.last_name}
    return jsonify(user_data)

# Assuming User.update_one and other database operations are implemented correctly in SQLAlchemy terms
# Remember to handle any SQLAlchemy queries and operations according to Flask-SQLAlchemy documentation

# Add to your Flask app

@app.route('/api/puzzle', methods=['GET'])
def get_puzzle():
    # Simple static 3x3 magic square (for demonstration)
    puzzle = [[2, 7, 6], [9, 5, 1], [4, 3, 8]]
    return jsonify({"puzzle": puzzle, "size": 3})


if __name__ == '__main__':
    app.run(debug=True)
