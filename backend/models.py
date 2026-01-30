from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        return {"type": "string"}

# Profile Models
class ProfileData(BaseModel):
    age: int
    monthly_income: float
    monthly_expenses: float
    family_size: int
    has_dependents: bool
    risk_comfort: str  # Low, Medium, High
    has_daughter: bool = False
    daughter_age: Optional[int] = None
    has_son: bool = False
    son_age: Optional[int] = None

# Protection Models
class TermInsurance(BaseModel):
    cover_amount: float
    tenure: int
    yearly_cost: float
    riders: List[str]

class HealthInsurance(BaseModel):
    cover_amount: float
    family_size: int
    yearly_cost: float

class ProtectionData(BaseModel):
    term_insurance: TermInsurance
    health_insurance: HealthInsurance

# Savings & Investment Models
class EmergencyFund(BaseModel):
    required_amount: float
    monthly_contribution: float
    tools: List[str]

class NPSPlan(BaseModel):
    target_corpus: float
    monthly_contribution: float
    expected_value: float
    years_to_retirement: int

class ChildPlan(BaseModel):
    scheme_name: str  # Sukanya or PPF
    yearly_deposit: float
    maturity_value: float
    years_to_maturity: int

class MutualFundPlan(BaseModel):
    monthly_sip: float
    index_allocation: float  # 60%
    active_allocation: float  # 40%
    expected_return: float
    projected_value: float

class GoldAllocation(BaseModel):
    monthly_amount: float
    percentage: float  # 5-10%

class StockAllocation(BaseModel):
    monthly_amount: float
    percentage: float
    risk_disclaimer: bool

class WealthData(BaseModel):
    emergency_fund: EmergencyFund
    nps_plan: NPSPlan
    child_plans: List[ChildPlan] = []
    mutual_funds: MutualFundPlan
    gold: GoldAllocation
    stocks: Optional[StockAllocation] = None

# Goal Model
class Goal(BaseModel):
    goal_id: str
    name: str
    amount_today: float
    time_horizon: int  # years
    future_cost: float  # inflation adjusted
    monthly_saving: float
    probability: str  # Low, Medium, High

class GoalsData(BaseModel):
    goals: List[Goal] = []

# Main Financial Plan Model
class FinancialPlan(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    profile: ProfileData
    protection: ProtectionData
    wealth: WealthData
    goals: GoalsData
    total_monthly_savings: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# Request/Response Models
class FinancialPlanCreate(BaseModel):
    user_id: str
    profile: ProfileData

class FinancialPlanResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    profile: ProfileData
    protection: ProtectionData
    wealth: WealthData
    goals: GoalsData
    total_monthly_savings: float
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True

# Government Scheme Rates
class SchemeRate(BaseModel):
    scheme_name: str
    interest_rate: float
    tax_benefit: str
    description: str
    last_updated: datetime = Field(default_factory=datetime.utcnow)