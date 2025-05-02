from abc import ABC, abstractmethod
import numpy as np
from typing import List, Tuple, Optional
from .models import Point

class BaseRegressor(ABC):
    def generate_line_points(self, X: np.ndarray, y: np.ndarray) -> List[Point]:
        """
        Generate points for drawing the regression line
        
        Args:
            X: Input features array
            y: Target values array (needed for fitting)
            
        Returns:
            List of points for drawing the line
        """
        # Generate 100 points spanning the x range with some padding
        x_min, x_max = X.min(), X.max()
        padding = (x_max - x_min) * 0.1  # Add 10% padding on each side
        x_line = np.linspace(x_min - padding, x_max + padding, 100).reshape(-1, 1)
        
        # Get predictions for these points
        _, _, _, y_line = self.fit_and_predict(X, y, x_line)
        
        # Create list of points
        return [Point(x=float(x), y=float(y)) for x, y in zip(x_line.flatten(), y_line)]
    
    @abstractmethod
    def fit_and_predict(self, X: np.ndarray, y: np.ndarray, X_test: Optional[np.ndarray] = None) -> Tuple[Optional[List[float]], Optional[float], float, List[float]]:
        """
        Fit the model and return predictions
        
        Args:
            X: Input features for training
            y: Target values for training
            X_test: Optional input features for prediction (if None, use X)
            
        Returns:
            Tuple containing:
            - coefficients: List of model coefficients (None for models like trees)
            - intercept: Model intercept (None for models like trees)
            - r2_score: R-squared score
            - predictions: List of predictions
        """
        pass 