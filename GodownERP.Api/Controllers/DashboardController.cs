using GodownERP.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GodownERP.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        // ---------------------------
        // 1️⃣ Total Vendors
        // ---------------------------
        [HttpGet("total-vendors")]
        public async Task<IActionResult> GetTotalVendors()
        {
            var count = await _context.Vendors
                .Where(v => v.IsActive)
                .CountAsync();

            return Ok(new { TotalVendors = count });
        }

        // ---------------------------
        // 2️⃣ Total Products
        // ---------------------------
        [HttpGet("total-products")]
        public async Task<IActionResult> GetTotalProducts()
        {
            var count = await _context.Products
                .Where(p => p.IsActive)
                .CountAsync();

            return Ok(new { TotalProducts = count });
        }

        // ---------------------------
        // 3️⃣ Total Stock Quantity
        // ---------------------------
        [HttpGet("total-stock")]
        public async Task<IActionResult> GetTotalStock()
        {
            var totalStock = await _context.Products
                .Where(p => p.IsActive)
                .SumAsync(p => p.StockQuantity);

            return Ok(new { TotalStock = totalStock });
        }

        // ---------------------------
        // 4️⃣ Total Inventory Value
        // ---------------------------
        [HttpGet("inventory-value")]
        public async Task<IActionResult> GetInventoryValue()
        {
            var totalValue = await _context.Products
                .Where(p => p.IsActive)
                .SumAsync(p => p.CostPrice * p.StockQuantity);

            return Ok(new { InventoryValue = totalValue });
        }
    }
}