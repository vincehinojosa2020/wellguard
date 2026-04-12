"""
Backend API Tests for Type-A Platform
Tests all API endpoints including admin, dashboard, and scan functionality
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://sca-platform.preview.emergentagent.com')


class TestHealthCheck:
    """Health check endpoint tests"""
    
    def test_api_root(self):
        """Test API root endpoint returns correct response"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert data["message"] == "Type-A Platform API"
        print(f"✅ API root: {data}")


class TestDashboardStats:
    """Dashboard statistics endpoint tests"""
    
    def test_dashboard_stats(self):
        """Test dashboard stats returns scan statistics"""
        response = requests.get(f"{BASE_URL}/api/dashboard/stats")
        assert response.status_code == 200
        data = response.json()
        
        # Verify required fields
        assert "total_scans" in data
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
        
        print(f"✅ Dashboard stats: {data['total_scans']} scans, {data['total_vulnerabilities']} vulns")


class TestAdminStats:
    """Admin platform statistics tests"""
    
    def test_admin_stats_returns_1000_customers(self):
        """Test admin stats returns total_customers=1000"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code == 200
        data = response.json()
        
        # Verify seeded data
        assert data.get("seeded") == True
        assert data.get("total_customers") == 1000
        
        # Verify other required fields
        assert "total_applications" in data
        assert "total_scans" in data
        assert "total_mrr" in data
        assert "vulnerabilities" in data
        assert "tiers" in data
        assert "statuses" in data
        assert "support" in data
        assert "critical_customers" in data
        
        print(f"✅ Admin stats: {data['total_customers']} customers, ${data['total_mrr']} MRR")


class TestAdminCustomers:
    """Admin customers endpoint tests"""
    
    def test_list_customers_with_limit(self):
        """Test GET /api/admin/customers?limit=5 returns customers array"""
        response = requests.get(f"{BASE_URL}/api/admin/customers?limit=5")
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "customers" in data
        assert "total" in data
        assert isinstance(data["customers"], list)
        assert len(data["customers"]) == 5
        assert data["total"] == 1000
        
        # Verify customer structure
        customer = data["customers"][0]
        assert "id" in customer
        assert "name" in customer
        assert "tier" in customer
        assert "status" in customer
        assert "health_score" in customer
        assert "mrr" in customer
        
        print(f"✅ Customers list: {len(data['customers'])} returned, {data['total']} total")
    
    def test_customer_filtering_by_tier(self):
        """Test customer filtering by tier"""
        response = requests.get(f"{BASE_URL}/api/admin/customers?tier=Enterprise&limit=10")
        assert response.status_code == 200
        data = response.json()
        
        # All returned customers should be Enterprise tier
        for customer in data["customers"]:
            assert customer["tier"] == "Enterprise"
        
        print(f"✅ Tier filtering: {len(data['customers'])} Enterprise customers")
    
    def test_customer_filtering_by_status(self):
        """Test customer filtering by status"""
        response = requests.get(f"{BASE_URL}/api/admin/customers?status=critical&limit=10")
        assert response.status_code == 200
        data = response.json()
        
        # All returned customers should be critical status
        for customer in data["customers"]:
            assert customer["status"] == "critical"
        
        print(f"✅ Status filtering: {len(data['customers'])} critical customers")
    
    def test_customer_sorting(self):
        """Test customer sorting by health_score"""
        response = requests.get(f"{BASE_URL}/api/admin/customers?sort_by=health_score&sort_order=asc&limit=5")
        assert response.status_code == 200
        data = response.json()
        
        # Verify ascending order
        scores = [c["health_score"] for c in data["customers"]]
        assert scores == sorted(scores)
        
        print(f"✅ Sorting: health scores {scores}")
    
    def test_customer_detail(self):
        """Test getting customer detail by ID"""
        # First get a customer ID
        list_response = requests.get(f"{BASE_URL}/api/admin/customers?limit=1")
        customer_id = list_response.json()["customers"][0]["id"]
        
        # Get detail
        response = requests.get(f"{BASE_URL}/api/admin/customers/{customer_id}")
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "customer" in data
        assert "scans" in data
        assert "vulnerabilities" in data
        assert "support_tickets" in data
        
        # Verify customer data
        assert data["customer"]["id"] == customer_id
        
        print(f"✅ Customer detail: {data['customer']['name']}, {len(data['scans'])} scans")


class TestAdminAlerts:
    """Admin alerts endpoint tests"""
    
    def test_alerts_returns_critical_and_high_risk(self):
        """Test GET /api/admin/alerts returns critical_customers and high_risk_customers"""
        response = requests.get(f"{BASE_URL}/api/admin/alerts")
        assert response.status_code == 200
        data = response.json()
        
        # Verify required fields
        assert "critical_customers" in data
        assert "critical_tickets" in data
        assert "high_risk_customers" in data
        
        # Verify arrays
        assert isinstance(data["critical_customers"], list)
        assert isinstance(data["critical_tickets"], list)
        assert isinstance(data["high_risk_customers"], list)
        
        # Verify critical customer structure
        if data["critical_customers"]:
            cust = data["critical_customers"][0]
            assert "id" in cust
            assert "name" in cust
            assert "health_score" in cust
        
        # Verify high risk customer structure
        if data["high_risk_customers"]:
            cust = data["high_risk_customers"][0]
            assert "id" in cust
            assert "name" in cust
            assert "risk_score" in cust
        
        print(f"✅ Alerts: {len(data['critical_customers'])} critical, {len(data['high_risk_customers'])} high-risk")


class TestAdminTickets:
    """Admin tickets endpoint tests"""
    
    def test_tickets_list(self):
        """Test GET /api/admin/tickets?limit=5 returns tickets array"""
        response = requests.get(f"{BASE_URL}/api/admin/tickets?limit=5")
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "tickets" in data
        assert "total" in data
        assert isinstance(data["tickets"], list)
        assert len(data["tickets"]) == 5
        
        # Verify ticket structure
        ticket = data["tickets"][0]
        assert "ticket_number" in ticket
        assert "customer_name" in ticket
        assert "issue_type" in ticket
        assert "priority" in ticket
        assert "status" in ticket
        
        print(f"✅ Tickets: {len(data['tickets'])} returned, {data['total']} total")


class TestScans:
    """Scan endpoint tests"""
    
    def test_list_scans(self):
        """Test listing scans"""
        response = requests.get(f"{BASE_URL}/api/scans?limit=10")
        assert response.status_code == 200
        data = response.json()
        
        assert "scans" in data
        assert "total" in data
        assert isinstance(data["scans"], list)
        
        print(f"✅ Scans list: {len(data['scans'])} scans, {data['total']} total")
    
    def test_create_scan(self):
        """Test POST /api/scans with alpine:latest image"""
        response = requests.post(
            f"{BASE_URL}/api/scans",
            json={"target": "alpine:latest", "scan_type": "image"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify response
        assert "id" in data
        assert "status" in data
        assert data["status"] == "queued"
        
        print(f"✅ Scan created: {data['id']}, status: {data['status']}")
        return data["id"]
    
    def test_get_scan_status(self):
        """Test getting scan status"""
        # First create a scan
        create_response = requests.post(
            f"{BASE_URL}/api/scans",
            json={"target": "alpine:3.19", "scan_type": "image"}
        )
        scan_id = create_response.json()["id"]
        
        # Get scan status
        response = requests.get(f"{BASE_URL}/api/scans/{scan_id}")
        assert response.status_code == 200
        data = response.json()
        
        assert "id" in data
        assert "target" in data
        assert "status" in data
        assert data["id"] == scan_id
        
        print(f"✅ Scan status: {data['status']}")


class TestVulnerabilities:
    """Vulnerability endpoint tests"""
    
    def test_list_vulnerabilities(self):
        """Test listing vulnerabilities"""
        response = requests.get(f"{BASE_URL}/api/vulnerabilities?limit=10")
        assert response.status_code == 200
        data = response.json()
        
        assert "vulnerabilities" in data
        assert "total" in data
        assert isinstance(data["vulnerabilities"], list)
        
        # Verify vulnerability structure if any exist
        if data["vulnerabilities"]:
            vuln = data["vulnerabilities"][0]
            assert "vuln_id" in vuln
            assert "severity" in vuln
            assert "component" in vuln
        
        print(f"✅ Vulnerabilities: {len(data['vulnerabilities'])} returned, {data['total']} total")


class TestComponents:
    """Component endpoint tests"""
    
    def test_list_components(self):
        """Test listing components"""
        response = requests.get(f"{BASE_URL}/api/components?limit=10")
        assert response.status_code == 200
        data = response.json()
        
        assert "components" in data
        assert "total" in data
        assert isinstance(data["components"], list)
        
        # Verify component structure if any exist
        if data["components"]:
            comp = data["components"][0]
            assert "name" in comp
            assert "version" in comp
        
        print(f"✅ Components: {len(data['components'])} returned, {data['total']} total")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
