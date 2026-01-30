from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
from datetime import datetime
import uuid

from models import (
    FinancialPlan, FinancialPlanCreate, ProfileData, 
    ProtectionData, WealthData, GoalsData, Goal,
    FinancialPlanResponse
)
from financial_calculator import FinancialCalculator

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "PRP Finance API", "version": "1.0"}

@api_router.post("/calculate-plan")
async def calculate_financial_plan(profile: ProfileData):
    """Calculate comprehensive financial plan based on profile"""
    try:
        profile_dict = profile.model_dump()
        calculations = FinancialCalculator.calculate_comprehensive_plan(profile_dict)
        return calculations
    except Exception as e:
        logger.error(f"Error calculating plan: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/plans", response_model=dict)
async def create_plan(plan_data: dict):
    """Create and save a financial plan"""
    try:
        plan_data["_id"] = str(uuid.uuid4())
        plan_data["created_at"] = datetime.utcnow()
        plan_data["updated_at"] = datetime.utcnow()
        
        result = await db.financial_plans.insert_one(plan_data)
        
        if result.inserted_id:
            created_plan = await db.financial_plans.find_one({"_id": plan_data["_id"]})
            return {"id": created_plan["_id"], "message": "Plan saved successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to save plan")
    except Exception as e:
        logger.error(f"Error creating plan: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/plans/{user_id}")
async def get_user_plans(user_id: str):
    """Get all plans for a user"""
    try:
        plans = await db.financial_plans.find({"user_id": user_id}).to_list(100)
        return plans
    except Exception as e:
        logger.error(f"Error fetching plans: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/plan/{plan_id}")
async def get_plan(plan_id: str):
    """Get a specific plan by ID"""
    try:
        plan = await db.financial_plans.find_one({"_id": plan_id})
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        return plan
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching plan: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/plan/{plan_id}")
async def update_plan(plan_id: str, plan_data: dict):
    """Update an existing plan"""
    try:
        plan_data["updated_at"] = datetime.utcnow()
        result = await db.financial_plans.update_one(
            {"_id": plan_id},
            {"$set": plan_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        return {"message": "Plan updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating plan: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/plan/{plan_id}")
async def delete_plan(plan_id: str):
    """Delete a plan"""
    try:
        result = await db.financial_plans.delete_one({"_id": plan_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        return {"message": "Plan deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting plan: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/calculate-goal")
async def calculate_goal(goal_data: dict):
    """Calculate inflation-adjusted goal requirement"""
    try:
        amount = goal_data.get("amount_today")
        years = goal_data.get("years")
        
        if not amount or not years:
            raise HTTPException(status_code=400, detail="amount_today and years required")
        
        result = FinancialCalculator.calculate_goal_requirement(amount, years)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error calculating goal: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/scheme-rates")
async def get_scheme_rates():
    """Get current government scheme interest rates"""
    return {
        "schemes": [
            {
                "name": "Sukanya Samriddhi Yojana",
                "rate": 8.0,
                "description": "For girl child under 10 years",
                "tenure": "21 years",
                "tax_benefit": "Section 80C up to ₹1.5 lakh"
            },
            {
                "name": "Public Provident Fund (PPF)",
                "rate": 7.1,
                "description": "Long-term savings with tax benefits",
                "tenure": "15 years (extendable)",
                "tax_benefit": "Section 80C up to ₹1.5 lakh"
            },
            {
                "name": "National Pension System (NPS)",
                "rate": 10.0,
                "description": "Market-linked retirement savings",
                "tenure": "Till age 60",
                "tax_benefit": "Section 80C + 80CCD(1B) up to ₹2 lakh"
            }
        ]
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()