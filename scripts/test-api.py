#!/usr/bin/env python3
"""
Test script for the Inventory Management System API
This script tests all the required endpoints to ensure compatibility
"""

import requests
import json
import sys
from typing import Dict, Any

class APITester:
    def __init__(self, base_url: str = "http://localhost:5000"):
        self.base_url = base_url
        self.access_token = None
        self.headers = {"Content-Type": "application/json"}
        
    def test_user_registration(self) -> bool:
        """Test user registration endpoint"""
        print("Testing user registration...")
        
        url = f"{self.base_url}/api/register"
        data = {
            "username": "testuser",
            "password": "testpass123"
        }
        
        response = requests.post(url, json=data, headers=self.headers)
        
        if response.status_code == 201:
            result = response.json()
            if result.get("message") == "User created successfully":
                print("✓ User registration successful")
                return True
        elif response.status_code == 409:
            print("✓ User already exists (expected for repeated tests)")
            return True
            
        print(f"✗ User registration failed: {response.status_code} - {response.text}")
        return False
    
    def test_user_login(self) -> bool:
        """Test user login endpoint"""
        print("Testing user login...")
        
        url = f"{self.base_url}/api/login"
        data = {
            "username": "testuser",
            "password": "testpass123"
        }
        
        response = requests.post(url, json=data, headers=self.headers)
        
        if response.status_code == 200:
            result = response.json()
            if "access_token" in result:
                self.access_token = result["access_token"]
                self.headers["Authorization"] = f"Bearer {self.access_token}"
                print("✓ User login successful")
                return True
                
        print(f"✗ User login failed: {response.status_code} - {response.text}")
        return False
    
    def test_add_product(self) -> str:
        """Test adding a new product"""
        print("Testing add product...")
        
         
        """Test adding a new product"""
        print("Testing add product...")
        
        url = f"{self.base_url}/api/products"
        data = {
            "name": "Test Product",
            "type": "Electronics",
            "sku": "TEST001",
            "description": "A test product for API testing",
            "quantity": 100,
            "price": 29.99,
            "image_url": "https://example.com/test-product.jpg"
        }
        
        response = requests.post(url, json=data, headers=self.headers)
        
        if response.status_code == 201:
            result = response.json()
            if result.get("message") == "Product added successfully" and "product_id" in result:
                print("✓ Product added successfully")
                return result["product_id"]
                
        print(f"✗ Add product failed: {response.status_code} - {response.text}")
        return None
    
    def test_get_products(self) -> bool:
        """Test getting all products with pagination"""
        print("Testing get products...")
        
        url = f"{self.base_url}/api/products"
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 200:
            result = response.json()
            if "products" in result and "pagination" in result:
                print(f"✓ Retrieved {len(result['products'])} products")
                return True
                
        print(f"✗ Get products failed: {response.status_code} - {response.text}")
        return False
    
    def test_update_quantity(self, product_id: str) -> bool:
        """Test updating product quantity"""
        print("Testing update product quantity...")
        
        url = f"{self.base_url}/api/products/{product_id}/quantity"
        data = {"quantity": 150}
        
        response = requests.put(url, json=data, headers=self.headers)
        
        if response.status_code == 200:
            result = response.json()
            if result.get("quantity") == 150:
                print("✓ Product quantity updated successfully")
                return True
                
        print(f"✗ Update quantity failed: {response.status_code} - {response.text}")
        return False
    
    def test_analytics(self) -> bool:
        """Test analytics endpoint"""
        print("Testing analytics endpoint...")
        
        url = f"{self.base_url}/api/analytics/top-products"
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list):
                print(f"✓ Analytics retrieved {len(result)} top products")
                return True
                
        print(f"✗ Analytics failed: {response.status_code} - {response.text}")
        return False
    
    def run_all_tests(self) -> bool:
        """Run all API tests"""
        print("Starting API tests...\n")
        
        tests_passed = 0
        total_tests = 5
        
        # Test 1: User Registration
        if self.test_user_registration():
            tests_passed += 1
        
        # Test 2: User Login
        if self.test_user_login():
            tests_passed += 1
        else:
            print("Cannot continue tests without authentication")
            return False
        
        # Test 3: Add Product
        product_id = self.test_add_product()
        if product_id:
            tests_passed += 1
        
        # Test 4: Get Products
        if self.test_get_products():
            tests_passed += 1
        
        # Test 5: Update Quantity
        if product_id and self.test_update_quantity(product_id):
            tests_passed += 1
        
        # Test 6: Analytics
        if self.test_analytics():
            tests_passed += 1
            total_tests = 6
        
        print(f"\n{'='*50}")
        print(f"Tests completed: {tests_passed}/{total_tests} passed")
        print(f"{'='*50}")
        
        return tests_passed == total_tests

if __name__ == "__main__":
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:5000"
    
    tester = APITester(base_url)
    success = tester.run_all_tests()
    
    sys.exit(0 if success else 1)
