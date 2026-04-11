#!/usr/bin/env python3
"""
Backend API Testing for Type-A Platform
Tests all backend endpoints with real Trivy scanning functionality
"""

import requests
import json
import time
import sys
from datetime import datetime

# Backend URL from frontend .env
BACKEND_URL = "https://pensive-keldysh-9.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class TypeAPlatformTester:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        self.test_results = []
        self.scan_id = None
        
    def log_test(self, test_name, success, details="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
        print()
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'details': details,
            'timestamp': datetime.now().isoformat()
        })
    
    def test_health_check(self):
        """Test GET /api/ - Health check"""
        try:
            response = self.session.get(f"{API_BASE}/")
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "Type-A Platform API" in data["message"]:
                    self.log_test("Health Check", True, f"API responding: {data['message']}")
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected response format", data)
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_seed_data(self):
        """Test POST /api/seed - Seed demo data"""
        try:
            response = self.session.post(f"{API_BASE}/seed")
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test("Seed Data", True, f"Seeding result: {data['message']}")
                    return True
                else:
                    self.log_test("Seed Data", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("Seed Data", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Seed Data", False, f"Request error: {str(e)}")
            return False
    
    def test_dashboard_stats(self):
        """Test GET /api/dashboard/stats - Get dashboard statistics"""
        try:
            response = self.session.get(f"{API_BASE}/dashboard/stats")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['total_scans', 'total_vulnerabilities', 'total_components', 'severity']
                
                missing_fields = [field for field in required_fields if field not in data]
                if not missing_fields:
                    stats_summary = f"Scans: {data['total_scans']}, Vulns: {data['total_vulnerabilities']}, Components: {data['total_components']}"
                    self.log_test("Dashboard Stats", True, stats_summary)
                    return True
                else:
                    self.log_test("Dashboard Stats", False, f"Missing fields: {missing_fields}", data)
                    return False
            else:
                self.log_test("Dashboard Stats", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Dashboard Stats", False, f"Request error: {str(e)}")
            return False
    
    def test_list_scans(self):
        """Test GET /api/scans - List scan history"""
        try:
            response = self.session.get(f"{API_BASE}/scans")
            
            if response.status_code == 200:
                data = response.json()
                if "scans" in data and "total" in data:
                    scan_count = len(data["scans"])
                    total_count = data["total"]
                    self.log_test("List Scans", True, f"Retrieved {scan_count} scans (total: {total_count})")
                    return True
                else:
                    self.log_test("List Scans", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("List Scans", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("List Scans", False, f"Request error: {str(e)}")
            return False
    
    def test_create_scan(self):
        """Test POST /api/scans - Start a REAL Trivy scan"""
        try:
            scan_request = {
                "target": "alpine:3.19",
                "scan_type": "image"
            }
            
            response = self.session.post(f"{API_BASE}/scans", json=scan_request)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "status" in data:
                    self.scan_id = data["id"]
                    self.log_test("Create Scan", True, f"Scan initiated with ID: {self.scan_id}")
                    return True
                else:
                    self.log_test("Create Scan", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("Create Scan", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Create Scan", False, f"Request error: {str(e)}")
            return False
    
    def test_scan_status_polling(self):
        """Test GET /api/scans/{scan_id} - Poll scan status until completion"""
        if not self.scan_id:
            self.log_test("Scan Status Polling", False, "No scan ID available from previous test")
            return False
        
        try:
            max_wait_time = 120  # 2 minutes max wait
            poll_interval = 5    # Poll every 5 seconds
            start_time = time.time()
            
            print(f"🔄 Polling scan {self.scan_id} status (max wait: {max_wait_time}s)...")
            
            while time.time() - start_time < max_wait_time:
                response = self.session.get(f"{API_BASE}/scans/{self.scan_id}")
                
                if response.status_code == 200:
                    data = response.json()
                    status = data.get("status", "unknown")
                    
                    print(f"   Status: {status} (elapsed: {int(time.time() - start_time)}s)")
                    
                    if status == "completed":
                        summary = data.get("summary", {})
                        duration = data.get("duration", "unknown")
                        vuln_count = summary.get("total_vulnerabilities", 0)
                        comp_count = summary.get("total_components", 0)
                        
                        details = f"Completed in {duration}, found {vuln_count} vulnerabilities in {comp_count} components"
                        self.log_test("Scan Status Polling", True, details)
                        return True
                    
                    elif status == "error":
                        error_msg = data.get("error", "Unknown error")
                        self.log_test("Scan Status Polling", False, f"Scan failed: {error_msg}")
                        return False
                    
                    elif status in ["queued", "scanning"]:
                        # Continue polling
                        time.sleep(poll_interval)
                        continue
                    
                    else:
                        self.log_test("Scan Status Polling", False, f"Unknown status: {status}")
                        return False
                
                else:
                    self.log_test("Scan Status Polling", False, f"HTTP {response.status_code}", response.text)
                    return False
            
            # Timeout reached
            self.log_test("Scan Status Polling", False, f"Scan did not complete within {max_wait_time} seconds")
            return False
            
        except Exception as e:
            self.log_test("Scan Status Polling", False, f"Request error: {str(e)}")
            return False
    
    def test_list_vulnerabilities(self):
        """Test GET /api/vulnerabilities - List vulnerabilities"""
        try:
            response = self.session.get(f"{API_BASE}/vulnerabilities")
            
            if response.status_code == 200:
                data = response.json()
                if "vulnerabilities" in data and "total" in data:
                    vuln_count = len(data["vulnerabilities"])
                    total_count = data["total"]
                    
                    # Check if we have vulnerabilities from the scan
                    if total_count > 0:
                        # Verify vulnerability structure
                        first_vuln = data["vulnerabilities"][0] if data["vulnerabilities"] else {}
                        required_fields = ['vuln_id', 'severity', 'component', 'cvss']
                        missing_fields = [field for field in required_fields if field not in first_vuln]
                        
                        if not missing_fields:
                            self.log_test("List Vulnerabilities", True, f"Retrieved {vuln_count} vulnerabilities (total: {total_count})")
                            return True
                        else:
                            self.log_test("List Vulnerabilities", False, f"Missing fields in vulnerability: {missing_fields}")
                            return False
                    else:
                        self.log_test("List Vulnerabilities", True, "No vulnerabilities found (empty result is valid)")
                        return True
                else:
                    self.log_test("List Vulnerabilities", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("List Vulnerabilities", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("List Vulnerabilities", False, f"Request error: {str(e)}")
            return False
    
    def test_list_components(self):
        """Test GET /api/components - List components discovered in scan"""
        try:
            response = self.session.get(f"{API_BASE}/components")
            
            if response.status_code == 200:
                data = response.json()
                if "components" in data and "total" in data:
                    comp_count = len(data["components"])
                    total_count = data["total"]
                    
                    if total_count > 0:
                        # Verify component structure
                        first_comp = data["components"][0] if data["components"] else {}
                        required_fields = ['name', 'version', 'vulnerabilities', 'risk_score']
                        missing_fields = [field for field in required_fields if field not in first_comp]
                        
                        if not missing_fields:
                            self.log_test("List Components", True, f"Retrieved {comp_count} components (total: {total_count})")
                            return True
                        else:
                            self.log_test("List Components", False, f"Missing fields in component: {missing_fields}")
                            return False
                    else:
                        self.log_test("List Components", True, "No components found (empty result is valid)")
                        return True
                else:
                    self.log_test("List Components", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("List Components", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("List Components", False, f"Request error: {str(e)}")
            return False
    
    def test_dashboard_stats_updated(self):
        """Test GET /api/dashboard/stats - Verify stats updated with scan results"""
        try:
            response = self.session.get(f"{API_BASE}/dashboard/stats")
            
            if response.status_code == 200:
                data = response.json()
                
                # Check if stats show updated data from our scan
                total_scans = data.get("total_scans", 0)
                total_vulns = data.get("total_vulnerabilities", 0)
                total_comps = data.get("total_components", 0)
                
                # We should have at least some data now (seeded + our scan)
                if total_scans > 0:
                    stats_summary = f"Updated stats - Scans: {total_scans}, Vulns: {total_vulns}, Components: {total_comps}"
                    self.log_test("Dashboard Stats Updated", True, stats_summary)
                    return True
                else:
                    self.log_test("Dashboard Stats Updated", False, "No scans found in updated stats")
                    return False
            else:
                self.log_test("Dashboard Stats Updated", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Dashboard Stats Updated", False, f"Request error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all tests in the specified order"""
        print("🚀 Starting Type-A Platform Backend API Tests")
        print(f"Backend URL: {BACKEND_URL}")
        print("=" * 60)
        
        # Test sequence as specified in review request
        tests = [
            ("Health Check", self.test_health_check),
            ("Seed Demo Data", self.test_seed_data),
            ("Dashboard Stats (Initial)", self.test_dashboard_stats),
            ("List Scan History", self.test_list_scans),
            ("Create Real Trivy Scan", self.test_create_scan),
            ("Poll Scan Status", self.test_scan_status_polling),
            ("List Vulnerabilities", self.test_list_vulnerabilities),
            ("List Components", self.test_list_components),
            ("Dashboard Stats (Updated)", self.test_dashboard_stats_updated),
        ]
        
        passed = 0
        failed = 0
        
        for test_name, test_func in tests:
            print(f"Running: {test_name}")
            try:
                if test_func():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"❌ FAIL {test_name} - Unexpected error: {str(e)}")
                failed += 1
            
            print("-" * 40)
        
        # Summary
        print("\n" + "=" * 60)
        print("🏁 TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📊 Total:  {passed + failed}")
        
        if failed == 0:
            print("\n🎉 All tests passed! Backend API is working correctly.")
            return True
        else:
            print(f"\n⚠️  {failed} test(s) failed. Check the details above.")
            return False

def main():
    """Main test execution"""
    tester = TypeAPlatformTester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()