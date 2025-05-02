# Interactive Regression Visualization

An interactive web application that allows users to visualize different regression models by plotting points on a canvas. The application supports linear regression, polynomial regression, and decision tree regression.

## Features

- Interactive canvas for plotting points
- Support for multiple regression models:
  - Linear Regression
  - Polynomial Regression (degree 2)
  - Decision Tree Regression (max depth 2)
  - Dummy Regressor (y=x)
- Real-time model fitting and visualization
- R² score display
- Draggable points for easy adjustment
- Clean, modern UI with Tailwind CSS
- **Password-protected login page**

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

3. Create a `.env.local` file in the `frontend` directory and set your app password:
   ```env
   NEXT_PUBLIC_APP_PASSWORD=yourpasswordhere
   ```

4. Start the development server:
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
   venv\Scripts\activate  # On Windows
   # or
   source venv/bin/activate  # On Mac/Linux
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. (Optional) Set allowed CORS origins in a `.env` file:
   ```env
   ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-url.vercel.app
   ```

5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

The backend API will be available at http://localhost:8000

## Usage

1. Open the application in your browser
2. Log in using the password you set in `.env.local`
3. Click on the canvas to add points (up to 50)
4. Drag points to adjust their positions
5. Select up to 2 regression models from the model choice panel
6. Click "Run model" to fit and visualize the regression(s)
7. View the R² score to evaluate the model's fit
8. Use the "Clear Points" button to start over

## API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_APP_PASSWORD=yourpasswordhere
```

### Backend (`backend/.env`)
```
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-url.vercel.app
```

## Deployment

- **Frontend:** Deploy easily to [Vercel](https://vercel.com/).
- **Backend:** Deploy to [Railway](https://railway.app/) or any platform supporting FastAPI.
- Make sure to set the appropriate environment variables in your deployment settings.

## Security Notes

- CORS is enabled and can be configured via environment variable.
- For production, consider adding rate limiting and/or API key authentication to the backend for additional security.

## License

MIT
