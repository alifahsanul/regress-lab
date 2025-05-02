import numpy as np
from sklearn.linear_model import LinearRegression
from typing import List, Tuple, Optional
from .base import BaseRegressor

class LinearRegressor(BaseRegressor):
    def fit_and_predict(self, X: np.ndarray, y: np.ndarray, X_test: Optional[np.ndarray] = None) -> Tuple[Optional[List[float]], Optional[float], float, List[float]]:
        model = LinearRegression()
        model.fit(X, y)
        
        coefficients = [float(coef) for coef in model.coef_]
        intercept = float(model.intercept_)
        
        # Use X_test for predictions if provided, otherwise use X
        X_pred = X_test if X_test is not None else X
        predictions = model.predict(X_pred).tolist()
        
        # Calculate R² score using training data
        r2_score = float(model.score(X, y))
        
        return coefficients, intercept, r2_score, predictions 