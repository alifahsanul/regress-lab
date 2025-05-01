from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Literal
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.tree import DecisionTreeRegressor

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Point(BaseModel):
    x: float
    y: float

class RegressionRequest(BaseModel):
    points: List[Point]
    model_type: Literal["linear", "polynomial", "tree"]
    polynomial_degree: int = 2
    tree_max_depth: int = 3

class RegressionResponse(BaseModel):
    coefficients: List[float]
    intercept: float
    r2_score: float
    predictions: List[float]

@app.post("/api/fit", response_model=RegressionResponse)
async def fit_regression(request: RegressionRequest):
    if len(request.points) < 2:
        raise HTTPException(status_code=400, detail="At least 2 points are required")

    # Extract X and y from points
    X = np.array([[p.x] for p in request.points])
    y = np.array([p.y for p in request.points])

    # Fit the appropriate model
    if request.model_type == "linear":
        model = LinearRegression()
        model.fit(X, y)
        coefficients = [model.coef_[0]]
        intercept = model.intercept_
        predictions = model.predict(X)
        r2_score = model.score(X, y)

    elif request.model_type == "polynomial":
        poly = PolynomialFeatures(degree=request.polynomial_degree)
        X_poly = poly.fit_transform(X)
        model = LinearRegression()
        model.fit(X_poly, y)
        coefficients = model.coef_.tolist()
        intercept = model.intercept_
        predictions = model.predict(X_poly)
        r2_score = model.score(X_poly, y)

    else:  # tree
        model = DecisionTreeRegressor(max_depth=request.tree_max_depth)
        model.fit(X, y)
        coefficients = [0]  # Trees don't have coefficients in the same way
        intercept = 0
        predictions = model.predict(X)
        r2_score = model.score(X, y)

    return RegressionResponse(
        coefficients=coefficients,
        intercept=intercept,
        r2_score=r2_score,
        predictions=predictions.tolist()
    )

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"} 