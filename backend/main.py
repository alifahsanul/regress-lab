from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import os

from regressor import Point, RegressionRequest, RegressionResponse, create_regressor

app = FastAPI()

# Get allowed origins from environment variable or use default
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://regress-lab.vercel.app"
).split(",")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # More secure CORS configuration
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return "roger"

@app.post("/api/fit", response_model=RegressionResponse)
async def fit_regression(request: RegressionRequest):
    print("Received /api/fit request")
    print(f"Points: {request.points}")
    print(f"Regression type: {request.regression_type}")
    print(f"Polynomial degree: {request.polynomial_degree}")
    print(f"Tree max depth: {request.tree_max_depth}")
    
    if len(request.points) < 2:
        print("Error: Less than 2 points provided")
        raise HTTPException(status_code=400, detail="At least 2 points are required")

    # Extract X and y from points
    X = np.array([[p.x] for p in request.points])
    y = np.array([p.y for p in request.points])

    # Create and fit the appropriate model
    try:
        regressor = create_regressor(
            regression_type=request.regression_type,
            polynomial_degree=request.polynomial_degree,
            tree_max_depth=request.tree_max_depth
        )
        # First fit and get predictions for original points
        coefficients, intercept, r2_score, predictions = regressor.fit_and_predict(X, y)
        
        # Generate points for drawing the regression line
        line_points = regressor.generate_line_points(X, y)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    print("Returning regression result")
    return RegressionResponse(
        coefficients=coefficients,
        intercept=intercept,
        r2_score=r2_score,
        predictions=predictions,
        line_points=line_points
    )

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}