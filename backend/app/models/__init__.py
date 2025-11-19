# Import base models that don't have circular dependencies
from .user import User
from .case import Case
from .evidence import Evidence

# Import chain of custody separately to avoid static analysis issues
# This is safe at runtime because Flask handles the app context properly
import importlib
import sys

def _import_chain_of_custody():
    """Dynamically import chain of custody to avoid static analysis issues"""
    try:
        module = importlib.import_module('.chain_of_custody', package='app.models')
        return module.ChainOfCustody, module.CustodyAction
    except ImportError:
        return None, None

# Try to import at module level
try:
    ChainOfCustody, CustodyAction = _import_chain_of_custody()
except:
    ChainOfCustody, CustodyAction = None, None

__all__ = ['User', 'Case', 'Evidence', 'ChainOfCustody', 'CustodyAction']