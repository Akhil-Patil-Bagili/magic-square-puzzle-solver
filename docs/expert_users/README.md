# Magic Square Puzzle Solver

## Description

Magic Square Puzzle Solver is an engaging web application that challenges users to solve magic square puzzles. It combines fun and interactivity, allowing users to delve into one of the most ancient and complex mathematical puzzles.

## Quick Links

- **GitHub Repository:** [View on GitHub](https://github.com/Akhil-Patil-Bagili/magic-square-puzzle-solver)

## Getting Started

These instructions will guide you on how to get a copy of the project up and running on your local machine for development and testing purposes. You have the option to run the project using Docker (recommended for its simplicity) or manually setting it up locally.

### Prerequisites

Before you begin, ensure you have the following installed:
- Git
- Docker (for Docker setup)
- Python 3.8 or higher (for local setup)
- Node.js and npm (for local setup)

### Setup and Running


#### Option 1: Local Setup (Recommended)


**Backend Setup:**

1. Navigate to the backend directory:
    ```bash
    cd dev/backend
    ```

2. Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3. Run the backend server:
    ```bash
    flask run
    ```

**Note:** 

**1. Keep the terminal up and running.**

**2. Open a new terminal and navigate to the project root directory.**

**Frontend Setup:**

1. Navigate to the frontend directory:
    ```bash
    cd dev/frontend
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the frontend development server:
    ```bash
    npm run dev
    ```

4. The web application will be available at [http://localhost:3000](http://localhost:3000).


#### Option 2: Docker Setup

1. **Clone the Repository**
    ```bash
    git clone https://github.com/Akhil-Patil-Bagili/magic-square-puzzle-solver.git
    ```

2. **Navigate to Project Directory**
    ```bash
    cd dev
    ```

3. **Build and Run with Docker Compose**
    ```bash
    docker-compose up --build
    ```

4. **Access the Application**
    The web application will be available at [http://localhost:3000](http://localhost:3000).

## Project Milestones

- **Week 1:** Setup repository and Flask application. Begin puzzle generation strategy development.
- **Week 2:** Implement magic square generation algorithm and basic user interaction.
- **Week 3:** Develop frontend interactions using React.
- **Week 4:** Enhance the algorithm for dynamic puzzle generation.
- **Week 5:** Conduct testing, integrate feedback, and enhance UI.

## Algorithms and AI Schemes

- **Magic Square Generation:** Employs mathematical techniques to generate solvable puzzles, ensuring each row, column, and diagonal sum to the same constant.
- **Solution Validation:** Provides real-time feedback on user attempts, validating puzzle solutions.

## Market Space and Unique Selling Points

- **Engaging Gameplay:** Combines education and entertainment, improving problem-solving, and mathematical skills.
- **Accessible Interface:** Designed for ease of use, accommodating users of varying technical backgrounds.
- **Adaptive Difficulty:** Offers puzzles of different sizes and complexities, appealing to novices and experts alike.
- **Instant Feedback:** Validates puzzle solutions instantly, enriching the user experience.
- **Community Engagement:** Encourages a sense of community among puzzle enthusiasts.

## Authors

- **Akhil Patil Bagili**

## Version History

- **0.1:** Initial Release
