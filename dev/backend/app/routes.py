from flask import jsonify, request
from .models import User, db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import numpy as np
import random
from datetime import timedelta
from flask import current_app


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
            access_token = create_access_token(identity=user.username, expires_delta=timedelta(hours=1))
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
    
    @app.route('/api/puzzle/generate', methods=['GET'])
    def generate_puzzle():
        global generated_numbers
        try:
            level = request.args.get('level', default=1, type=int)
            level = max(1, min(level, 2))  # Adjust to only have levels 1 (easy) and 2 (medium)
            generated_numbers = adjust_numbers_for_level(level)
            get_magic_sum()
            current_app.logger.debug(generated_numbers)
            return jsonify({"numbers": generated_numbers.tolist(), "level": level})
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500

    @app.route('/api/magic-square/check', methods=['POST'])
    def check_solution():
        data = request.get_json()
        matrix = data.get('matrix')
        if not matrix or not all(len(row) == 3 for row in matrix) or len(matrix) != 3:
            return jsonify({"error": "Invalid matrix size"}), 400

        flat_matrix = [num for row in matrix for num in row]
        if check_magic_square(np.array(flat_matrix).reshape(3, 3)):
            return jsonify({"message": "Congratulations, it's a magic square!"}), 200
        else:
            return jsonify({"message": "Sorry, that's not a magic square. Try again!"}), 200

    @app.route('/api/puzzle/solution', methods=['GET'])
    def reveal_solution():
        try:
            level = request.args.get('level', default=1, type=int)
            solution = adjust_numbers_for_level(level)
            return jsonify({"solution": solution.tolist()})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @app.route('/api/hints/partial-solution', methods=['GET'])
    def get_partial_solution():
        try:
            level = request.args.get('level', default=1, type=int)
            adjusted_square = adjust_numbers_for_level(level).tolist()

            num_reveals = 3
            rows = len(adjusted_square)
            cols = len(adjusted_square[0])
            
            
            all_indices = [(i, j) for i in range(rows) for j in range(cols)]
            
            
            random.shuffle(all_indices)
            selected_indices = []
            rows_selected = set()
            cols_selected = set()

            for i, j in all_indices:
                if len(selected_indices) < num_reveals and i not in rows_selected and j not in cols_selected:
                    selected_indices.append((i, j))
                    rows_selected.add(i)
                    cols_selected.add(j)

            
            for i in range(rows):
                for j in range(cols):
                    if (i, j) not in selected_indices:
                        adjusted_square[i][j] = None 

            return jsonify({"partialSolution": adjusted_square})
        except Exception as e:
            return jsonify({"error": str(e)}), 500


    @app.route('/api/hints/magic-sum', methods=['GET'])
    def get_magic_sum():
        global generated_numbers  # Access the global variable
        try:
            if generated_numbers is None:
                return jsonify({"error": "No puzzle generated yet"}), 400

            magic_sum = np.sum(generated_numbers[0])  # Use the stored numbers directly
            current_app.logger.debug(f'Magic Sum: {magic_sum}') 
            return jsonify({"magicSum": int(magic_sum)})  # Convert to int
        except Exception as e:
            app.logger.error(f"Failed to get magic sum: {str(e)}")  # Log detailed error
            return jsonify({"error": "Internal server error", "message": str(e)}), 500



    def generate_magic_square():
        return np.array([[8, 1, 6], [3, 5, 7], [4, 9, 2]])

    def adjust_numbers_for_level(level):
        magic_square = generate_magic_square()
        multiplier, offset = (1, random.randint(0, 10)) if level == 1 else (2, random.randint(30, 49))
        adjusted_square = (magic_square * multiplier) + offset
        return adjusted_square

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
