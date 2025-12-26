// API Base URL - Change this to your backend URL
const API_URL = 'http://localhost:3000';

// Fetch and display dashboard data
async function loadDashboardData() {
    try {
        // Fetch summary data
        const summaryResponse = await fetch(`${API_URL}/api/dashboard/summary`);
        const summary = await summaryResponse.json();
        
        // Update balance card
        document.getElementById('totalBalance').textContent = `₹${summary.totalBalance.toLocaleString()}`;
        document.getElementById('income').textContent = `₹${summary.income.toLocaleString()}`;
        document.getElementById('expenses').textContent = `₹${summary.expenses.toLocaleString()}`;
        
        // Fetch categories data
        const categoriesResponse = await fetch(`${API_URL}/api/dashboard/categories`);
        const categories = await categoriesResponse.json();
        
        // Render chart and legend
        renderChart(categories);
        renderLegend(categories);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Use fallback data if API fails
        useFallbackData();
    }
}

// Render spending chart
function renderChart(categories) {
    const canvas = document.getElementById('spendingChart');
    const ctx = canvas.getContext('2d');
    
    // Colors for each category
    const colors = ['#3b82f6', '#f97316', '#ec4899', '#8b5cf6'];
    
    // Calculate total and percentages
    const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
    let currentAngle = -Math.PI / 2; // Start from top
    
    // Set canvas size
    canvas.width = 200;
    canvas.height = 200;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 70;
    const innerRadius = 45;
    
    // Draw each category
    categories.forEach((category, index) => {
        const sliceAngle = (category.amount / total) * 2 * Math.PI;
        
        // Draw outer arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        ctx.fillStyle = colors[index];
        ctx.fill();
        
        currentAngle += sliceAngle;
    });
    
    // Draw center circle (donut hole)
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
}

// Render category legend
function renderLegend(categories) {
    const legend = document.getElementById('categoryLegend');
    const colors = ['#3b82f6', '#f97316', '#ec4899', '#8b5cf6'];
    
    legend.innerHTML = categories.map((category, index) => `
        <div class="category-item">
            <div class="category-color" style="background-color: ${colors[index]}"></div>
            <span class="category-name">${category.name}</span>
            <span class="category-amount">₹${category.amount.toLocaleString()}</span>
        </div>
    `).join('');
}

// Fallback data if API is not available
function useFallbackData() {
    const fallbackCategories = [
        { name: "Food", amount: 1200 },
        { name: "Transport", amount: 800 },
        { name: "Bills", amount: 2500 },
        { name: "Shopping", amount: 3000 }
    ];
    
    renderChart(fallbackCategories);
    renderLegend(fallbackCategories);
}

// Load data when page loads
window.addEventListener('DOMContentLoaded', loadDashboardData);
