import numpy as np
from sklearn.tree import DecisionTreeRegressor as SklearnDecisionTreeRegressor
from typing import List, Tuple, Optional
from .base import BaseRegressor

class DecisionTreeRegressor(BaseRegressor):
    def __init__(self, max_depth: int = 3):
        self.max_depth = max_depth
        
    def fit_and_predict(self, X: np.ndarray, y: np.ndarray, X_test: Optional[np.ndarray] = None) -> Tuple[Optional[List[float]], Optional[float], float, List[float]]:
        model = SklearnDecisionTreeRegressor(max_depth=self.max_depth)
        model.fit(X, y)
        
        # Decision trees don't have coefficients or intercept
        coefficients = None
        intercept = None
        
        # Use X_test for predictions if provided, otherwise use X
        X_pred = X_test if X_test is not None else X
        predictions = model.predict(X_pred).tolist()
        
        # Calculate R² score using training data
        r2_score = float(model.score(X, y))
        
        return coefficients, intercept, r2_score, predictions 