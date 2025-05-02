import numpy as np
from typing import List, Tuple, Optional
from .base import BaseRegressor

class DummyRegressor(BaseRegressor):
    """A simple regressor that always predicts a line y = x"""
    
    def fit_and_predict(self, X: np.ndarray, y: np.ndarray, X_test: Optional[np.ndarray] = None) -> Tuple[Optional[List[float]], Optional[float], float, List[float]]:
        # For dummy regressor, we don't need to fit anything
        # Always predict y = x (slope = 1, intercept = 0)
        coefficients = [1.0]  # slope of 1
        intercept = 0.0      # intercept of 0
        
        # Use X_test for predictions if provided, otherwise use X
        X_pred = X_test if X_test is not None else X
        predictions = X_pred.flatten().tolist()
        
        # Calculate R² score using training data
        y_pred = X.flatten()  # predictions for training data
        y_mean = np.mean(y)
        ss_tot = np.sum((y - y_mean) ** 2)
        ss_res = np.sum((y - y_pred) ** 2)
        r2_score = float(1 - (ss_res / ss_tot)) if ss_tot != 0 else 0.0
        
        return coefficients, intercept, r2_score, predictions 