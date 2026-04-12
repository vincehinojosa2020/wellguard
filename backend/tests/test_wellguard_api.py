"""
WellGuard SCA Backend API Tests
Tests for the WELLGUARD SCA platform APIs
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthAndRoot:
    """Basic health check and root endpoint tests"""
    
    def test_root_endpoint(self):
        """Test root API endpoint returns correct response"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
        # Note: Backend still returns "Type-A Platform API" - this is expected
        # as the backend was not rebranded, only the frontend
        print(f"Root endpoint response: {data}")


class TestDashboardStats:
    """Dashboard statistics endpoint tests"""
    
    def test_dashboard_stats_endpoint(self):
        """Test dashboard stats returns expected structure"""
        response = requests.get(f"{BASE_URL}/api/dashboard/stats")
        assert response.status_code == 200
        data = response.json()
        
        # Verify expected fields exist
        assert "total_scans" in data
        assert "completed_scans" in data
        assert "total_vulnerabilities" in data
        assert "total_components" in data
        assert "severity" in data
        assert "recent_scans" in data
        
        # Verify severity breakdown
        severity = data["severity"]
        assert "critical" in severity
        assert "high" in severity
        assert "medium" in severity
        assert "low" in severity
        
        print(f"Dashboard stats: total_scans={data['total_scans']}, total_vulns={data['total_vulnerabilities']}")


class TestScansAPI:
    """Scan-related endpoint tests"""
    
    def test_list_scans(self):
        """Test listing scans with pagination"""
        response = requests.get(f"{BASE_URL}/api/scans?limit=10")
        assert response.status_code == 200
        data = response.json()
        
        assert "scans" in data
        assert "total" in data
        assert isinstance(data["scans"], list)
        
        print(f"Scans list: {len(data['scans'])} scans returned, total={data['total']}")
    
    def test_create_scan(self):
        """Test creating a new scan (Trivy may not be installed)"""
        payload = {
            "target": "alpine:latest",
            "scan_type": "image"
        }
        response = requests.post(f"{BASE_URL}/api/scans", json=payload)
        assert response.status_code == 200
        data = response.json()
        
        assert "id" in data
        assert "status" in data
        assert data["status"] == "queued"
        
        print(f"Created scan: id={data['id']}, status={data['status']}")
        return data["id"]
    
    def test_create_scan_invalid_target(self):
        """Test scan creation with invalid target is rejected"""
        payload = {
            "target": "invalid;rm -rf /",  # Command injection attempt
            "scan_type": "image"
        }
        response = requests.post(f"{BASE_URL}/api/scans", json=payload)
        # Should be rejected with 400
        assert response.status_code == 400
        print("Invalid target correctly rejected")
    
    def test_get_scan_not_found(self):
        """Test getting non-existent scan returns 404"""
        response = requests.get(f"{BASE_URL}/api/scans/nonexistent-scan-id")
        assert response.status_code == 404


class TestVulnerabilitiesAPI:
    """Vulnerability endpoint tests"""
    
    def test_list_vulnerabilities(self):
        """Test listing vulnerabilities"""
        response = requests.get(f"{BASE_URL}/api/vulnerabilities?limit=20")
        assert response.status_code == 200
        data = response.json()
        
        assert "vulnerabilities" in data
        assert "total" in data
        assert isinstance(data["vulnerabilities"], list)
        
        print(f"Vulnerabilities: {len(data['vulnerabilities'])} returned, total={data['total']}")
    
    def test_filter_vulnerabilities_by_severity(self):
        """Test filtering vulnerabilities by severity"""
        response = requests.get(f"{BASE_URL}/api/vulnerabilities?severity=CRITICAL&limit=10")
        assert response.status_code == 200
        data = response.json()
        
        # All returned vulns should be CRITICAL
        for vuln in data["vulnerabilities"]:
            assert vuln.get("severity") == "CRITICAL"
        
        print(f"Critical vulnerabilities: {len(data['vulnerabilities'])}")


class TestComponentsAPI:
    """Component endpoint tests"""
    
    def test_list_components(self):
        """Test listing components"""
        response = requests.get(f"{BASE_URL}/api/components?limit=20")
        assert response.status_code == 200
        data = response.json()
        
        assert "components" in data
        assert "total" in data
        assert isinstance(data["components"], list)
        
        print(f"Components: {len(data['components'])} returned, total={data['total']}")


class TestAdminAPI:
    """Admin/Support Engineering endpoint tests"""
    
    def test_admin_stats(self):
        """Test admin platform stats"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code == 200
        data = response.json()
        
        # Check if data is seeded
        if data.get("seeded") == False:
            print("Admin data not seeded - skipping detailed checks")
            return
        
        assert "total_customers" in data
        assert "total_applications" in data
        print(f"Admin stats: {data.get('total_customers')} customers")
    
    def test_admin_customers_list(self):
        """Test listing customers"""
        response = requests.get(f"{BASE_URL}/api/admin/customers?limit=5")
        assert response.status_code == 200
        data = response.json()
        
        assert "customers" in data
        assert "total" in data
        print(f"Customers: {len(data['customers'])} returned")
    
    def test_admin_alerts(self):
        """Test admin alerts endpoint"""
        response = requests.get(f"{BASE_URL}/api/admin/alerts")
        assert response.status_code == 200
        data = response.json()
        
        assert "critical_customers" in data
        assert "critical_tickets" in data
        assert "high_risk_customers" in data
        print(f"Alerts: {len(data['critical_customers'])} critical customers")
    
    def test_admin_tickets(self):
        """Test support tickets endpoint"""
        response = requests.get(f"{BASE_URL}/api/admin/tickets?limit=5")
        assert response.status_code == 200
        data = response.json()
        
        assert "tickets" in data
        assert "total" in data
        print(f"Tickets: {len(data['tickets'])} returned")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
