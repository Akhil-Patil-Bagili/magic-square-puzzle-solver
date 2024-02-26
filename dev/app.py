from flask import Flask, jsonify

app = Flask(__name__)

def generate_magic_square(n=3):
    magic_square = [[0]*n for _ in range(n)]
    num = 1
    i, j = 0, n//2
    
    while num <= n**2:
        magic_square[i][j] = num
        num += 1
        newi, newj = (i-1) % n, (j+1) % n
        if magic_square[newi][newj]:
            i += 1
        else:
            i, j = newi, newj
            
    return magic_square

@app.route('/')
def hello_world():
    return jsonify(message="Hello, world! Welcome to the Magic Square Puzzle Solver!")

@app.route('/magic-square')
def magic_square():
    square = generate_magic_square()
    return jsonify(square=square)

if __name__ == '__main__':
    app.run(debug=True)
