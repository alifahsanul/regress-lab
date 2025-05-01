# Interactive Regression Visualization

An interactive web application that allows users to visualize different regression models by plotting points on a canvas. The application supports linear regression, polynomial regression, and decision tree regression.

## Features

- Interactive canvas for plotting points
- Support for multiple regression models:
  - Linear Regression
  - Polynomial Regression (degree 2-5)
  - Decision Tree Regression (max depth 1-5)
- Real-time model fitting and visualization
- R² score display
- Draggable points for easy adjustment
- Clean, modern UI with Tailwind CSS

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- D3.js for visualization
- Zustand for state management
- Framer Motion for animations

### Backend
- FastAPI
- scikit-learn
- NumPy
- Python 3.8+

## Setup

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:3000

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

The backend API will be available at http://localhost:8000

## Usage

1. Open the application in your browser
2. Click on the canvas to add points
3. Drag points to adjust their positions
4. Select a regression model from the control panel
5. Adjust model parameters as needed
6. View the R² score to evaluate the model's fit
7. Use the "Clear Points" button to start over

## API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## License

MIT
