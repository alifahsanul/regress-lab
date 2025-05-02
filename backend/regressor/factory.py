from typing import Literal
from .base import BaseRegressor
from .linear import LinearRegressor
from .polynomial import PolynomialRegressor
from .tree import DecisionTreeRegressor
from .dummy import DummyRegressor

def create_regressor(
    regression_type: Literal["linear", "polynomial", "tree", "dummy"],
    polynomial_degree: int = 2,
    tree_max_depth: int = 3
) -> BaseRegressor:
    """
    Factory function to create the appropriate regressor based on type
    """
    if regression_type == "linear":
        return LinearRegressor()
    elif regression_type == "polynomial":
        return PolynomialRegressor(degree=polynomial_degree)
    elif regression_type == "tree":
        return DecisionTreeRegressor(max_depth=tree_max_depth)
    elif regression_type == "dummy":
        return DummyRegressor()
    else:
        raise ValueError(f"Unknown regression type: {regression_type}") 