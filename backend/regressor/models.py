from pydantic import BaseModel
from typing import List, Literal, Optional

class Point(BaseModel):
    x: float
    y: float

class RegressionRequest(BaseModel):
    points: List[Point]
    regression_type: Literal["linear", "polynomial", "tree", "dummy"]
    polynomial_degree: int = 2
    tree_max_depth: int = 3

class RegressionResponse(BaseModel):
    coefficients: Optional[List[float]] = None
    intercept: Optional[float] = None
    r2_score: float
    predictions: List[float]
    line_points: List[Point] 