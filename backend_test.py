#!/usr/bin/env python3
"""
PRP Finance Backend API Testing Suite
Tests all backend endpoints with comprehensive scenarios
"""

import requests
import json
import uuid
from datetime import datetime
import sys

# Backend URL from environment
BACKEND_URL = "https://future-mapper-9.preview.emergentagent.com/api"

class PRPFinanceAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.test_results = []
        self.failed_tests = []
        
    def log_test(self, test_name, success, details=""):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        if not success:
            self.failed_tests.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
    
    def test_root_endpoint(self):
        """Test the root API endpoint"""
        try:
            response = requests.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "PRP Finance API" in data["message"]:
                    self.log_test("Root endpoint", True, f"Response: {data}")
                else:
                    self.log_test("Root endpoint", False, f"Unexpected response: {data}")
            else:
                self.log_test("Root endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Root endpoint", False, f"Exception: {str(e)}")
    
    def test_scheme_rates(self):
        """Test GET /api/scheme-rates endpoint"""
        try:
            response = requests.get(f"{self.base_url}/scheme-rates")
            if response.status_code == 200:
                data = response.json()
                schemes = data.get("schemes", [])
                
                # Verify expected schemes and rates
                expected_schemes = {
                    "Sukanya Samriddhi Yojana": 8.0,
                    "Public Provident Fund (PPF)": 7.1,
                    "National Pension System (NPS)": 10.0
                }
                
                found_schemes = {}
                for scheme in schemes:
                    found_schemes[scheme["name"]] = scheme["rate"]
                
                all_correct = True
                for name, expected_rate in expected_schemes.items():
                    if name not in found_schemes:
                        all_correct = False
                        self.log_test(f"Scheme rates - {name} missing", False)
                    elif found_schemes[name] != expected_rate:
                        all_correct = False
                        self.log_test(f"Scheme rates - {name} rate incorrect", False, 
                                    f"Expected: {expected_rate}%, Got: {found_schemes[name]}%")
                
                if all_correct:
                    self.log_test("Scheme rates endpoint", True, f"All schemes present with correct rates")
            else:
                self.log_test("Scheme rates endpoint", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Scheme rates endpoint", False, f"Exception: {str(e)}")
    
    def test_calculate_plan_young_professional(self):
        """Test calculate-plan with young professional scenario"""
        profile = {
            "age": 25,
            "monthly_income": 50000,
            "monthly_expenses": 30000,
            "family_size": 1,
            "has_dependents": False,
            "risk_comfort": "Medium",
            "has_daughter": False,
            "has_son": False
        }
        
        try:
            response = requests.post(f"{self.base_url}/calculate-plan", json=profile)
            if response.status_code == 200:
                data = response.json()
                
                # Verify structure and calculations
                success = True
                details = []
                
                # Check protection calculations
                if "protection" in data:
                    term_insurance = data["protection"]["term_insurance"]
                    annual_income = profile["monthly_income"] * 12
                    
                    # Term insurance should be 10-15x annual income
                    expected_min = annual_income * 10
                    expected_max = annual_income * 15
                    cover = term_insurance["cover_amount"]
                    
                    if not (expected_min <= cover <= expected_max):
                        success = False
                        details.append(f"Term insurance cover {cover} not in range {expected_min}-{expected_max}")
                    
                    # Health insurance for single person
                    health_insurance = data["protection"]["health_insurance"]
                    if health_insurance["cover_amount"] != 1000000:  # 10 lakh for single person
                        success = False
                        details.append(f"Health insurance should be 10 lakh for single person, got {health_insurance['cover_amount']}")
                else:
                    success = False
                    details.append("Protection data missing")
                
                # Check wealth calculations
                if "wealth" in data:
                    wealth = data["wealth"]
                    
                    # Emergency fund should be 6x monthly expenses
                    emergency = wealth["emergency_fund"]
                    expected_emergency = profile["monthly_expenses"] * 6
                    if emergency["required_amount"] != expected_emergency:
                        success = False
                        details.append(f"Emergency fund should be {expected_emergency}, got {emergency['required_amount']}")
                    
                    # NPS calculations
                    nps = wealth["nps_plan"]
                    if nps["years_to_retirement"] != 35:  # 60 - 25
                        success = False
                        details.append(f"Years to retirement should be 35, got {nps['years_to_retirement']}")
                else:
                    success = False
                    details.append("Wealth data missing")
                
                # Check total monthly savings
                if "total_monthly_savings" in data:
                    total_savings = data["total_monthly_savings"]
                    surplus = profile["monthly_income"] - profile["monthly_expenses"]
                    if total_savings > surplus:
                        success = False
                        details.append(f"Total savings {total_savings} exceeds surplus {surplus}")
                
                self.log_test("Calculate plan - Young professional", success, "; ".join(details) if details else "All calculations correct")
            else:
                self.log_test("Calculate plan - Young professional", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Calculate plan - Young professional", False, f"Exception: {str(e)}")
    
    def test_calculate_plan_middle_aged_parent(self):
        """Test calculate-plan with middle-aged parent scenario"""
        profile = {
            "age": 35,
            "monthly_income": 100000,
            "monthly_expenses": 50000,
            "family_size": 4,
            "has_dependents": True,
            "risk_comfort": "Medium",
            "has_daughter": True,
            "daughter_age": 5,
            "has_son": True,
            "son_age": 8
        }
        
        try:
            response = requests.post(f"{self.base_url}/calculate-plan", json=profile)
            if response.status_code == 200:
                data = response.json()
                
                success = True
                details = []
                
                # Check family health insurance (should be 15 lakh for family of 4)
                if "protection" in data:
                    health_insurance = data["protection"]["health_insurance"]
                    if health_insurance["cover_amount"] != 1500000:
                        success = False
                        details.append(f"Health insurance should be 15 lakh for family of 4, got {health_insurance['cover_amount']}")
                
                # Check child plans
                if "wealth" in data and "child_plans" in data["wealth"]:
                    child_plans = data["wealth"]["child_plans"]
                    
                    # Should have Sukanya for daughter under 10
                    sukanya_found = False
                    ppf_found = False
                    
                    for plan in child_plans:
                        if plan["scheme_name"] == "Sukanya Samriddhi Yojana":
                            sukanya_found = True
                            # Verify maturity calculation
                            if plan["years_to_maturity"] != 16:  # 21 - 5
                                success = False
                                details.append(f"Sukanya maturity should be in 16 years, got {plan['years_to_maturity']}")
                        elif plan["scheme_name"] == "PPF":
                            ppf_found = True
                            if plan["years_to_maturity"] != 15:
                                success = False
                                details.append(f"PPF maturity should be in 15 years, got {plan['years_to_maturity']}")
                    
                    if not sukanya_found:
                        success = False
                        details.append("Sukanya plan missing for daughter under 10")
                    
                    if not ppf_found:
                        success = False
                        details.append("PPF plan missing for son")
                else:
                    success = False
                    details.append("Child plans missing")
                
                self.log_test("Calculate plan - Middle-aged parent", success, "; ".join(details) if details else "All calculations correct")
            else:
                self.log_test("Calculate plan - Middle-aged parent", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Calculate plan - Middle-aged parent", False, f"Exception: {str(e)}")
    
    def test_calculate_plan_near_retirement(self):
        """Test calculate-plan with near retirement scenario"""
        profile = {
            "age": 50,
            "monthly_income": 150000,
            "monthly_expenses": 70000,
            "family_size": 2,
            "has_dependents": False,
            "risk_comfort": "Low",
            "has_daughter": False,
            "has_son": False
        }
        
        try:
            response = requests.post(f"{self.base_url}/calculate-plan", json=profile)
            if response.status_code == 200:
                data = response.json()
                
                success = True
                details = []
                
                # Check retirement calculations
                if "wealth" in data and "nps_plan" in data["wealth"]:
                    nps = data["wealth"]["nps_plan"]
                    if nps["years_to_retirement"] != 10:  # 60 - 50
                        success = False
                        details.append(f"Years to retirement should be 10, got {nps['years_to_retirement']}")
                    
                    # Higher monthly contribution expected due to shorter time
                    if nps["monthly_contribution"] <= 0:
                        success = False
                        details.append("NPS monthly contribution should be positive")
                else:
                    success = False
                    details.append("NPS plan missing")
                
                # No child plans expected
                if "wealth" in data:
                    child_plans = data["wealth"].get("child_plans", [])
                    if len(child_plans) > 0:
                        success = False
                        details.append("No child plans expected for this profile")
                
                # Lower risk should mean no stocks allocation
                if "wealth" in data and "stocks" in data["wealth"] and data["wealth"]["stocks"]:
                    success = False
                    details.append("No stocks allocation expected for low risk profile")
                
                self.log_test("Calculate plan - Near retirement", success, "; ".join(details) if details else "All calculations correct")
            else:
                self.log_test("Calculate plan - Near retirement", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Calculate plan - Near retirement", False, f"Exception: {str(e)}")
    
    def test_calculate_goal(self):
        """Test calculate-goal endpoint with inflation adjustment"""
        goal_data = {
            "amount_today": 1000000,  # 10 lakh today
            "years": 10
        }
        
        try:
            response = requests.post(f"{self.base_url}/calculate-goal", json=goal_data)
            if response.status_code == 200:
                data = response.json()
                
                success = True
                details = []
                
                # Verify inflation adjustment (6% inflation rate)
                expected_future_cost = 1000000 * (1.06 ** 10)  # ~1.79 lakh
                actual_future_cost = data.get("future_cost", 0)
                
                # Allow 1% tolerance for rounding
                if abs(actual_future_cost - expected_future_cost) / expected_future_cost > 0.01:
                    success = False
                    details.append(f"Future cost calculation incorrect. Expected: ~{expected_future_cost:.0f}, Got: {actual_future_cost}")
                
                # Verify monthly saving is positive
                monthly_saving = data.get("monthly_saving", 0)
                if monthly_saving <= 0:
                    success = False
                    details.append("Monthly saving should be positive")
                
                # Verify all required fields present
                required_fields = ["amount_today", "future_cost", "years", "monthly_saving"]
                for field in required_fields:
                    if field not in data:
                        success = False
                        details.append(f"Missing field: {field}")
                
                self.log_test("Calculate goal with inflation", success, "; ".join(details) if details else f"Correct inflation adjustment: {actual_future_cost:.0f}")
            else:
                self.log_test("Calculate goal with inflation", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Calculate goal with inflation", False, f"Exception: {str(e)}")
    
    def test_save_and_retrieve_plan(self):
        """Test saving and retrieving financial plans"""
        # Generate unique user ID
        user_id = str(uuid.uuid4())
        
        # Sample plan data
        plan_data = {
            "user_id": user_id,
            "profile": {
                "age": 30,
                "monthly_income": 75000,
                "monthly_expenses": 45000,
                "family_size": 2,
                "has_dependents": False,
                "risk_comfort": "Medium"
            },
            "protection": {
                "term_insurance": {
                    "cover_amount": 9000000,
                    "tenure": 30,
                    "yearly_cost": 4500,
                    "riders": ["Critical Illness"]
                },
                "health_insurance": {
                    "cover_amount": 1000000,
                    "family_size": 2,
                    "yearly_cost": 25000
                }
            },
            "wealth": {
                "emergency_fund": {
                    "required_amount": 270000,
                    "monthly_contribution": 22500,
                    "tools": ["Auto-sweep account"]
                },
                "nps_plan": {
                    "target_corpus": 15000000,
                    "monthly_contribution": 15000,
                    "expected_value": 15000000,
                    "years_to_retirement": 30
                },
                "child_plans": [],
                "mutual_funds": {
                    "monthly_sip": 10000,
                    "index_allocation": 6000,
                    "active_allocation": 4000,
                    "expected_return": 13.0,
                    "projected_value": 5000000
                },
                "gold": {
                    "monthly_amount": 2000,
                    "percentage": 7.5
                }
            },
            "goals": {
                "goals": []
            },
            "total_monthly_savings": 50000
        }
        
        try:
            # Test saving plan
            save_response = requests.post(f"{self.base_url}/plans", json=plan_data)
            if save_response.status_code == 200:
                save_data = save_response.json()
                plan_id = save_data.get("id")
                
                if plan_id:
                    self.log_test("Save financial plan", True, f"Plan saved with ID: {plan_id}")
                    
                    # Test retrieving user plans
                    retrieve_response = requests.get(f"{self.base_url}/plans/{user_id}")
                    if retrieve_response.status_code == 200:
                        plans = retrieve_response.json()
                        
                        if isinstance(plans, list) and len(plans) > 0:
                            found_plan = None
                            for plan in plans:
                                if plan.get("_id") == plan_id:
                                    found_plan = plan
                                    break
                            
                            if found_plan:
                                # Verify plan data integrity
                                if (found_plan.get("user_id") == user_id and 
                                    found_plan.get("profile", {}).get("age") == 30):
                                    self.log_test("Retrieve user plans", True, f"Plan retrieved successfully")
                                else:
                                    self.log_test("Retrieve user plans", False, "Plan data corrupted")
                            else:
                                self.log_test("Retrieve user plans", False, "Saved plan not found in user plans")
                        else:
                            self.log_test("Retrieve user plans", False, "No plans returned or invalid format")
                    else:
                        self.log_test("Retrieve user plans", False, f"Status: {retrieve_response.status_code}")
                else:
                    self.log_test("Save financial plan", False, "No plan ID returned")
            else:
                self.log_test("Save financial plan", False, f"Status: {save_response.status_code}, Response: {save_response.text}")
        except Exception as e:
            self.log_test("Save/Retrieve financial plan", False, f"Exception: {str(e)}")
    
    def test_error_handling(self):
        """Test API error handling with invalid data"""
        
        # Test calculate-plan with missing required fields
        try:
            invalid_profile = {"age": 25}  # Missing required fields
            response = requests.post(f"{self.base_url}/calculate-plan", json=invalid_profile)
            
            if response.status_code in [400, 422]:  # Bad request or validation error
                self.log_test("Error handling - Invalid profile", True, f"Correctly returned {response.status_code}")
            else:
                self.log_test("Error handling - Invalid profile", False, f"Expected 400/422, got {response.status_code}")
        except Exception as e:
            self.log_test("Error handling - Invalid profile", False, f"Exception: {str(e)}")
        
        # Test calculate-goal with missing fields
        try:
            invalid_goal = {"amount_today": 100000}  # Missing years
            response = requests.post(f"{self.base_url}/calculate-goal", json=invalid_goal)
            
            if response.status_code in [400, 422]:
                self.log_test("Error handling - Invalid goal", True, f"Correctly returned {response.status_code}")
            else:
                self.log_test("Error handling - Invalid goal", False, f"Expected 400/422, got {response.status_code}")
        except Exception as e:
            self.log_test("Error handling - Invalid goal", False, f"Exception: {str(e)}")
        
        # Test retrieving non-existent user plans
        try:
            fake_user_id = "non-existent-user-id"
            response = requests.get(f"{self.base_url}/plans/{fake_user_id}")
            
            if response.status_code == 200:
                plans = response.json()
                if isinstance(plans, list) and len(plans) == 0:
                    self.log_test("Error handling - Non-existent user", True, "Correctly returned empty list")
                else:
                    self.log_test("Error handling - Non-existent user", False, f"Unexpected response: {plans}")
            else:
                self.log_test("Error handling - Non-existent user", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Error handling - Non-existent user", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all test scenarios"""
        print(f"🚀 Starting PRP Finance Backend API Tests")
        print(f"📍 Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Run all tests
        self.test_root_endpoint()
        self.test_scheme_rates()
        self.test_calculate_plan_young_professional()
        self.test_calculate_plan_middle_aged_parent()
        self.test_calculate_plan_near_retirement()
        self.test_calculate_goal()
        self.test_save_and_retrieve_plan()
        self.test_error_handling()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = total_tests - len(self.failed_tests)
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                print(f"  • {test['test']}: {test['details']}")
        
        return len(self.failed_tests) == 0

if __name__ == "__main__":
    tester = PRPFinanceAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! Backend APIs are working correctly.")
        sys.exit(0)
    else:
        print(f"\n⚠️  {len(tester.failed_tests)} test(s) failed. Please check the issues above.")
        sys.exit(1)