import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from typing import List, Tuple, Optional
from .base import BaseRegressor

class PolynomialRegressor(BaseRegressor):
    def __init__(self, degree: int = 2):
        self.degree = degree
        
    def fit_and_predict(self, X: np.ndarray, y: np.ndarray, X_test: Optional[np.ndarray] = None) -> Tuple[Optional[List[float]], Optional[float], float, List[float]]:
        poly = PolynomialFeatures(degree=self.degree)
        X_poly = poly.fit_transform(X)
        
        model = LinearRegression()
        model.fit(X_poly, y)
        
        coefficients = [float(coef) for coef in model.coef_]
        intercept = float(model.intercept_)
        
        # Use X_test for predictions if provided, otherwise use X
        X_pred = X_test if X_test is not None else X
        X_pred_poly = poly.transform(X_pred)
        predictions = model.predict(X_pred_poly).tolist()
        
        # Calculate R² score using training data
        r2_score = float(model.score(X_poly, y))
        
        return coefficients, intercept, r2_score, predictions 