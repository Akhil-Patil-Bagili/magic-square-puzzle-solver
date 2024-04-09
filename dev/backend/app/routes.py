from flask import jsonify, request
from .models import User, db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import numpy as np
import random

def init_routes(app):
    @app.route('/')
    def hello_world():
        return 'Magic Square Puzzle Solver Backend Running!'

    @app.route('/api/users/register', methods=['POST'])
    def register():
        data = request.get_json()
        if not all(field in data for field in ['username', 'password', 'firstName', 'lastName']):
            return jsonify({'message': 'All fields are required'}), 400

        username = data['username']
        password = data['password']
        first_name = data['firstName'].capitalize()
        last_name = data['lastName'].capitalize()

        if User.query.filter_by(username=username).first():
            return jsonify({'message': 'User already exists!'}), 409

        new_user = User(username=username, first_name=first_name, last_name=last_name)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201

    @app.route('/api/users/login', methods=['POST'])
    def login():
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and user.check_password(data['password']):
            access_token = create_access_token(identity=user.username)
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({'message': 'Invalid username or password'}), 401

    @app.route('/api/users/me', methods=['GET'])
    @jwt_required()
    def get_user_info():
        current_user_username = get_jwt_identity()
        user = User.query.filter_by(username=current_user_username).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        user_data = {
            'firstName': user.first_name,
            'lastName': user.last_name,
            'username': user.username
        }
        return jsonify(user_data), 200

    @app.route('/api/users/update', methods=['PUT'])
    @jwt_required()
    def update_user_details():
        current_user_username = get_jwt_identity()
        user = User.query.filter_by(username=current_user_username).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404

        data = request.get_json()
        if 'firstName' in data:
            user.first_name = data['firstName'].capitalize()
        if 'lastName' in data:
            user.last_name = data['lastName'].capitalize()
        if 'password' in data:
            user.set_password(data['password'])

        db.session.commit()
        return jsonify({'message': 'User details updated successfully'}), 200
    
    # working code

# def generate_magic_square_numbers():
#     # This is a simple 3x3 magic square pattern where the sum of numbers in any row, 
#     # column or diagonal equals 15. We can shuffle these numbers for variability.
#     numbers = [2, 7, 6, 9, 5, 1, 4, 3, 8]
#     random.shuffle(numbers)
#     return numbers

# @app.route('/api/puzzle/generate', methods=['GET'])
# def generate_puzzle():
#     numbers = generate_magic_square_numbers()
#     return jsonify({"numbers": numbers})

    def check_magic_square(matrix):
        n = len(matrix)  
        magic_sum = sum(matrix[0]) 

        for row in matrix:
            if sum(row) != magic_sum:
                return False

        for col in range(n):
            if sum(row[col] for row in matrix) != magic_sum:
                return False

        if sum(matrix[i][i] for i in range(n)) != magic_sum or sum(matrix[i][n-1-i] for i in range(n)) != magic_sum:
            return False

        return True

    # @app.route('/api/magic-square/check', methods=['POST'])
    # def check_solution():
    #     data = request.get_json()
    #     matrix = data.get('matrix')

    #     if not matrix or not all(len(row) == 3 for row in matrix) or len(matrix) != 3:
    #         return jsonify({"error": "Invalid matrix size"}), 400

    #     if check_magic_square(matrix):
    #         return jsonify({"message": "Congratulations, it's a magic square!"}), 200
    #     else:
    #         return jsonify({"message": "Sorry, that's not a magic square. Try again!"}), 200


    def generate_magic_square():
        """
        This function generates a 3x3 magic square.
        A 3x3 magic square always results in a sum of 15 for all rows, columns, and diagonals.
        """
        magic_square = np.array([[8, 1, 6],
                                [3, 5, 7],
                                [4, 9, 2]])
        return magic_square

    def adjust_numbers_for_level(level):
        """
        Adjusts the numbers in the magic square according to the level.
        """
        magic_square = generate_magic_square()
        if level == 1:
            adjustment_factor = range(1, 20)
        elif level == 2:
            adjustment_factor = range(20, 50)
        elif level == 3:
            adjustment_factor = range(50, 100)
        else:  # level 4
            adjustment_factor = range(100, 200)
        
        # Generate a list of unique numbers from the specified range
        numbers = random.sample(adjustment_factor, 9)
        # Map these numbers onto the magic square based on their rank (sorted position)
        ranking = np.argsort(numbers)
        adjusted_square = np.zeros_like(magic_square)
        for rank, value in enumerate(np.nditer(magic_square)):
            adjusted_square[np.where(magic_square == value)] = numbers[ranking[rank]]
        
        return adjusted_square.flatten().tolist()

    @app.route('/api/puzzle/generate', methods=['GET'])
    def generate_puzzle():
        level = request.args.get('level', default=1, type=int)
        level = max(1, min(level, 4))
        numbers = adjust_numbers_for_level(level)
        return jsonify({"numbers": numbers, "level": level})

    @app.route('/api/magic-square/check', methods=['POST'])
    def check_solution():
        data = request.get_json()
        matrix = data.get('matrix')

        if not matrix or not all(len(row) == 3 for row in matrix) or len(matrix) != 3:
            return jsonify({"error": "Invalid matrix size"}), 400

        # Flatten the matrix to simplify checking
        flat_matrix = [num for row in matrix for num in row]
        if check_magic_square(np.array(flat_matrix).reshape(3, 3)):
            return jsonify({"message": "Congratulations, it's a magic square!"}), 200
        else:
            return jsonify({"message": "Sorry, that's not a magic square. Try again!"}), 200