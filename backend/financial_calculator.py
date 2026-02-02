import math
from typing import Dict, Tuple

# Constants
INFLATION_RATE = 0.06  # 6% for India
SUKANYA_RATE = 0.08  # 8%
PPF_RATE = 0.071  # 7.1%
NPS_EXPECTED_RETURN = 0.10  # 10% (equity heavy)
MF_INDEX_RETURN = 0.12  # 12%
MF_ACTIVE_RETURN = 0.14  # 14%
GOLD_RETURN = 0.08  # 8%

class FinancialCalculator:
    
    @staticmethod
    def calculate_term_insurance_coverage(annual_income: float, age: int) -> Dict:
        """Calculate term insurance coverage based on income and age"""
        # Formula: 15-20x annual income
        multiplier = 20  # Using 20x as recommended
        recommended_cover = annual_income * multiplier
        min_cover = annual_income * 15
        max_cover = annual_income * 20
        
        # Tenure: till age 80
        tenure = 80 - age
        
        # Estimated yearly premium: 0.8% - 1.2% of cover amount
        yearly_cost_min = recommended_cover * 0.008
        yearly_cost_max = recommended_cover * 0.012
        yearly_cost = (yearly_cost_min + yearly_cost_max) / 2
        
        return {
            "min_cover": round(min_cover, 2),
            "max_cover": round(max_cover, 2),
            "recommended_cover": round(recommended_cover, 2),
            "tenure": tenure,
            "yearly_cost": round(yearly_cost, 2),
            "yearly_cost_range": {
                "min": round(yearly_cost_min, 2),
                "max": round(yearly_cost_max, 2)
            },
            "monthly_cost": round(yearly_cost / 12, 2),
            "riders": ["Critical Illness", "Accidental Death"]
        }
    
    @staticmethod
    def calculate_health_insurance(family_size: int) -> Dict:
        """Calculate health insurance coverage"""
        # Rules:
        # Couple (1-2) → ₹15 lakh
        # Family with kids (3+) → ₹20 lakh
        if family_size <= 2:
            cover = 1500000  # 15 lakh
        else:
            cover = 2000000  # 20 lakh
        
        # Cost: ₹15-20 lakh → ₹18,000 – ₹30,000 per year
        if cover == 1500000:
            yearly_cost = 18000
        else:
            yearly_cost = 24000
        
        monthly_cost = yearly_cost / 12
        
        return {
            "cover_amount": cover,
            "yearly_cost": yearly_cost,
            "monthly_cost": round(monthly_cost, 2),
            "tips": [
                "Choose room rent flexibility",
                "Opt for family floater",
                "Prefer fewer restrictions"
            ]
        }
    
    @staticmethod
    def calculate_emergency_fund(monthly_expenses: float) -> Dict:
        """Calculate emergency fund requirement"""
        # Formula: Monthly Expense × 6
        required = monthly_expenses * 6
        
        # Build period: 24 months (default)
        build_period = 24
        monthly_contribution = required / build_period
        
        return {
            "required_amount": round(required, 2),
            "monthly_contribution": round(monthly_contribution, 2),
            "build_period": build_period,
            "tools": ["Auto-sweep account", "Liquid fund"]
        }
    
    @staticmethod
    def calculate_retirement_corpus(current_monthly_expense: float, age: int, retirement_age: int = 60) -> Dict:
        """Calculate retirement corpus using simple formula"""
        years_to_retirement = retirement_age - age
        
        # Target Corpus = Monthly Expense × 12 × 25 to 30 (using 30)
        multiplier = 30
        target_corpus = current_monthly_expense * 12 * multiplier
        
        # Simple formula (no compounding)
        # Monthly NPS = Target Corpus ÷ Months left
        months_left = years_to_retirement * 12
        
        if months_left > 0:
            monthly_nps = target_corpus / months_left
        else:
            monthly_nps = 0
        
        return {
            "target_corpus": round(target_corpus, 2),
            "years_to_retirement": years_to_retirement,
            "months_left": months_left,
            "monthly_contribution": round(monthly_nps, 2),
            "multiplier": multiplier
        }
    
    @staticmethod
    def calculate_sukanya_samriddhi(daughter_age: int, yearly_deposit: float = 150000) -> Dict:
        """Calculate Sukanya Samriddhi Yojana returns"""
        # Max yearly deposit = ₹1.5 lakh
        max_yearly = 150000
        yearly_deposit = min(yearly_deposit, max_yearly)
        
        # Can invest till girl turns 15, matures at 21
        years_of_investment = 15 - daughter_age if daughter_age < 15 else 0
        years_to_maturity = 21 - daughter_age
        
        if years_of_investment <= 0:
            return {
                "yearly_deposit": yearly_deposit,
                "monthly_equivalent": round(yearly_deposit / 12, 2),
                "maturity_value": 0,
                "years_to_maturity": years_to_maturity,
                "total_investment": 0,
                "message": "Can only invest till daughter turns 15"
            }
        
        # Future value of annuity due (payments at start of year) - 8% rate
        r = SUKANYA_RATE
        n = years_to_maturity
        
        # FV for investment period
        fv_investment = yearly_deposit * (((math.pow(1 + r, years_of_investment) - 1) / r) * (1 + r))
        
        # Compound remaining years
        remaining_years = years_to_maturity - years_of_investment
        maturity_value = fv_investment * math.pow(1 + r, remaining_years)
        
        return {
            "yearly_deposit": yearly_deposit,
            "monthly_equivalent": round(yearly_deposit / 12, 2),
            "years_of_investment": years_of_investment,
            "years_to_maturity": years_to_maturity,
            "maturity_value": round(maturity_value, 2),
            "total_investment": yearly_deposit * years_of_investment,
            "interest_earned": round(maturity_value - (yearly_deposit * years_of_investment), 2)
        }
    
    @staticmethod
    def calculate_ppf(yearly_deposit: float = 50000, years: int = 15) -> Dict:
        """Calculate PPF returns"""
        # Suggested yearly deposit = ₹50,000 – ₹1,00,000
        # Assumed return = 7%
        
        # Future value of annuity due
        r = PPF_RATE  # 7.1%
        n = years
        
        maturity_value = yearly_deposit * (((math.pow(1 + r, n) - 1) / r) * (1 + r))
        total_investment = yearly_deposit * n
        
        return {
            "yearly_deposit": yearly_deposit,
            "monthly_equivalent": round(yearly_deposit / 12, 2),
            "tenure": years,
            "maturity_value": round(maturity_value, 2),
            "total_investment": total_investment,
            "interest_earned": round(maturity_value - total_investment, 2)
        }
    
    @staticmethod
    def calculate_sip_returns(monthly_sip: float, years: int, annual_return: float) -> float:
        """Calculate SIP future value"""
        r = annual_return / 12  # Monthly rate
        n = years * 12  # Total months
        
        if n > 0:
            future_value = monthly_sip * (((math.pow(1 + r, n) - 1) / r) * (1 + r))
        else:
            future_value = 0
        
        return round(future_value, 2)
    
    @staticmethod
    def calculate_goal_requirement(amount_today: float, years: int, inflation: float = INFLATION_RATE) -> Dict:
        """Calculate inflation-adjusted goal requirement"""
        future_cost = amount_today * math.pow(1 + inflation, years)
        
        # Calculate monthly savings needed (assuming 10% returns)
        r = 0.10 / 12
        n = years * 12
        
        if n > 0:
            monthly_saving = future_cost / (((math.pow(1 + r, n) - 1) / r) * (1 + r))
        else:
            monthly_saving = future_cost
        
        return {
            "amount_today": amount_today,
            "future_cost": round(future_cost, 2),
            "years": years,
            "monthly_saving": round(monthly_saving, 2)
        }
    
    @staticmethod
    def adjust_plan_to_budget(plan: Dict, available_savings: float) -> Dict:
        """Adjust plan based on available monthly savings"""
        adjustments = {
            "is_affordable": True,
            "deficit": 0,
            "suggestions": [],
            "adjusted_plan": None
        }
        
        required = plan["total_monthly_savings"]
        
        if required <= available_savings:
            adjustments["is_affordable"] = True
            return adjustments
        
        # Plan exceeds budget
        adjustments["is_affordable"] = False
        adjustments["deficit"] = required - available_savings
        
        # Create priority-based adjustments
        wealth = plan["wealth"]
        protection = plan["protection"]
        
        # Priority levels (essential to optional)
        essential = {
            "emergency_fund": wealth["emergency_fund"]["monthly_contribution"],
            "term_insurance": protection["term_insurance"]["yearly_cost"] / 12,
            "health_insurance": protection["health_insurance"]["yearly_cost"] / 12,
        }
        
        important = {
            "nps": wealth["nps_plan"]["monthly_contribution"],
            "child_plans": sum([cp["yearly_deposit"] for cp in wealth["child_plans"]]) / 12 if wealth["child_plans"] else 0,
        }
        
        optional = {
            "mutual_funds": wealth["mutual_funds"]["monthly_sip"],
            "gold": wealth["gold"]["monthly_amount"],
            "stocks": wealth["stocks"]["monthly_amount"] if wealth.get("stocks") else 0,
        }
        
        essential_total = sum(essential.values())
        important_total = sum(important.values())
        optional_total = sum(optional.values())
        
        # Generate suggestions based on deficit
        if available_savings < essential_total:
            adjustments["suggestions"].append({
                "priority": "critical",
                "message": f"Your available savings (₹{available_savings:.0f}) are less than essential protection (₹{essential_total:.0f}). Consider increasing income or reducing expenses."
            })
        elif available_savings < (essential_total + important_total):
            adjustments["suggestions"].append({
                "priority": "high",
                "message": f"Focus on essentials first. Consider reducing or delaying child education plans until income increases."
            })
            # Suggest adjusted child plans
            if important["child_plans"] > 0:
                reduced_child = max(0, available_savings - essential_total)
                adjustments["suggestions"].append({
                    "priority": "medium",
                    "message": f"Reduce child plan contributions to ₹{reduced_child:.0f}/month temporarily."
                })
        else:
            # Can afford essential + important, adjust optional
            available_for_optional = available_savings - essential_total - important_total
            adjustments["suggestions"].append({
                "priority": "medium",
                "message": f"Allocate ₹{available_for_optional:.0f}/month to wealth building (mutual funds, gold)."
            })
            
            # Suggest proportion
            if available_for_optional > 0:
                mf_percent = 0.7
                gold_percent = 0.3
                adjustments["suggestions"].append({
                    "priority": "low",
                    "message": f"Suggested allocation: ₹{available_for_optional * mf_percent:.0f} mutual funds, ₹{available_for_optional * gold_percent:.0f} gold."
                })
        
        return adjustments
    
    @staticmethod
    def calculate_comprehensive_plan(profile_data: dict) -> Dict:
        """Calculate complete 20-year financial plan"""
        age = profile_data["age"]
        monthly_income = profile_data["monthly_income"]
        monthly_expenses = profile_data["monthly_expenses"]
        family_size = profile_data["family_size"]
        has_daughter = profile_data.get("has_daughter", False)
        daughter_age = profile_data.get("daughter_age")
        has_son = profile_data.get("has_son", False)
        risk_comfort = profile_data.get("risk_comfort", "Medium")
        
        # Calculate annual income
        annual_income = monthly_income * 12
        
        # Calculate available monthly savings
        available_monthly_savings = monthly_income - monthly_expenses
        
        # 1. Protection
        term_insurance = FinancialCalculator.calculate_term_insurance_coverage(annual_income, age)
        health_insurance = FinancialCalculator.calculate_health_insurance(family_size)
        
        # 2. Emergency Fund
        emergency_fund = FinancialCalculator.calculate_emergency_fund(monthly_expenses)
        
        # 3. Retirement (NPS)
        retirement = FinancialCalculator.calculate_retirement_corpus(monthly_expenses, age)
        
        # 4. Child Plans
        child_plans = []
        if has_daughter and daughter_age is not None and daughter_age < 10:
            # Suggest ₹50k per year for Sukanya
            sukanya_deposit = 50000
            sukanya = FinancialCalculator.calculate_sukanya_samriddhi(daughter_age, sukanya_deposit)
            child_plans.append({
                "scheme_name": "Sukanya Samriddhi Yojana",
                "yearly_deposit": sukanya_deposit,
                "maturity_value": sukanya["maturity_value"],
                "years_to_maturity": sukanya["years_to_maturity"]
            })
        
        if has_son:
            # Suggest ₹50k per year for PPF
            ppf_deposit = 50000
            ppf = FinancialCalculator.calculate_ppf(ppf_deposit)
            child_plans.append({
                "scheme_name": "PPF",
                "yearly_deposit": ppf_deposit,
                "maturity_value": ppf["maturity_value"],
                "years_to_maturity": 15
            })
        
        # 5. Calculate surplus for wealth building
        monthly_commitments = (
            term_insurance["yearly_cost_range"]["min"] / 12 +
            health_insurance["yearly_cost"] / 12 +
            emergency_fund["monthly_contribution"] +
            retirement["monthly_contribution"] +
            sum([cp["yearly_deposit"] for cp in child_plans]) / 12
        )
        
        surplus = monthly_income - monthly_expenses - monthly_commitments
        
        # 6. Mutual Funds (60% of surplus)
        mf_amount = max(surplus * 0.6, 0)
        mf_future_value = FinancialCalculator.calculate_sip_returns(mf_amount, 20, 0.13)  # 13% average
        
        # 7. Gold (5-10% of surplus)
        gold_amount = max(surplus * 0.075, 0)  # 7.5%
        
        # 8. Stocks (optional, if high risk and surplus available)
        stock_amount = 0
        if risk_comfort == "High" and surplus > mf_amount + gold_amount:
            stock_amount = min(surplus * 0.15, surplus - mf_amount - gold_amount)
        
        return {
            "protection": {
                "term_insurance": {
                    "cover_amount": term_insurance["recommended_cover"],
                    "tenure": term_insurance["tenure"],
                    "yearly_cost": term_insurance["yearly_cost_range"]["min"],
                    "riders": term_insurance["riders"]
                },
                "health_insurance": {
                    "cover_amount": health_insurance["cover_amount"],
                    "family_size": family_size,
                    "yearly_cost": health_insurance["yearly_cost"]
                }
            },
            "wealth": {
                "emergency_fund": emergency_fund,
                "nps_plan": {
                    "target_corpus": retirement["target_corpus"],
                    "monthly_contribution": retirement["monthly_contribution"],
                    "expected_value": retirement["target_corpus"],
                    "years_to_retirement": retirement["years_to_retirement"]
                },
                "child_plans": child_plans,
                "mutual_funds": {
                    "monthly_sip": round(mf_amount, 2),
                    "index_allocation": round(mf_amount * 0.6, 2),
                    "active_allocation": round(mf_amount * 0.4, 2),
                    "expected_return": 13.0,
                    "projected_value": mf_future_value
                },
                "gold": {
                    "monthly_amount": round(gold_amount, 2),
                    "percentage": 7.5
                },
                "stocks": {
                    "monthly_amount": round(stock_amount, 2),
                    "percentage": 15.0,
                    "risk_disclaimer": True
                } if stock_amount > 0 else None
            },
            "total_monthly_savings": round(monthly_commitments + mf_amount + gold_amount + stock_amount, 2),
            "surplus": round(surplus, 2),
            "available_monthly_savings": round(available_monthly_savings, 2),
            "affordability": FinancialCalculator.adjust_plan_to_budget(
                {
                    "protection": {
                        "term_insurance": {
                            "cover_amount": term_insurance["recommended_cover"],
                            "tenure": term_insurance["tenure"],
                            "yearly_cost": term_insurance["yearly_cost_range"]["min"],
                            "riders": term_insurance["riders"]
                        },
                        "health_insurance": {
                            "cover_amount": health_insurance["cover_amount"],
                            "family_size": family_size,
                            "yearly_cost": health_insurance["yearly_cost"]
                        }
                    },
                    "wealth": {
                        "emergency_fund": emergency_fund,
                        "nps_plan": {
                            "target_corpus": retirement["target_corpus"],
                            "monthly_contribution": retirement["monthly_contribution"],
                            "expected_value": retirement["target_corpus"],
                            "years_to_retirement": retirement["years_to_retirement"]
                        },
                        "child_plans": child_plans,
                        "mutual_funds": {
                            "monthly_sip": round(mf_amount, 2),
                            "index_allocation": round(mf_amount * 0.6, 2),
                            "active_allocation": round(mf_amount * 0.4, 2),
                            "expected_return": 13.0,
                            "projected_value": mf_future_value
                        },
                        "gold": {
                            "monthly_amount": round(gold_amount, 2),
                            "percentage": 7.5
                        },
                        "stocks": {
                            "monthly_amount": round(stock_amount, 2),
                            "percentage": 15.0,
                            "risk_disclaimer": True
                        } if stock_amount > 0 else None
                    },
                    "total_monthly_savings": round(monthly_commitments + mf_amount + gold_amount + stock_amount, 2)
                },
                available_monthly_savings
            )
        }