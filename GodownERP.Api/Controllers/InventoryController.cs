using GodownERP.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GodownERP.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class InventoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InventoryController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("history")]
        public async Task<IActionResult> GetInventoryHistory(Guid? productId, DateTime? startDate, DateTime? endDate, string? search, int page = 1, int pageSize = 10)
        {
            if (page <= 0)
            {
                page = 1;
            }

            if (pageSize <= 0 || pageSize > 100)
            {
                pageSize = 10;
            }
            var query = _context.InventoryTransactions
                .Include(t => t.Product)
                .Include(t => t.User)
                .AsQueryable();

            if (productId.HasValue)
            {
                query = query.Where(t => t.ProductId == productId.Value);
            }
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(t => t.Product.Name.Contains(search));
            }

            if (startDate.HasValue)
            {
                query = query.Where(t => t.CreatedAt >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(t => t.CreatedAt <= endDate.Value);
            }

            var totalRecords = await query.CountAsync();

            var history = await query
                .OrderByDescending(t => t.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new
                {
                    Product = t.Product.Name,
                    Type = t.Type,
                    Quantity = t.Quantity,
                    User = t.User.FullName,
                    Date = t.CreatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                TotalRecords = totalRecords,
                Page = page,
                PageSize = pageSize,
                Data = history
            });
        }
        [HttpGet("movement")]
        public async Task<IActionResult> GetInventoryMovement()
        {
            var today = DateTime.UtcNow.Date;
            var weekStart = today.AddDays(-7);

            var stockInToday = await _context.InventoryTransactions
                .Where(t => t.Type == "IN" && t.CreatedAt >= today)
                .SumAsync(t => t.Quantity);

            var stockOutToday = await _context.InventoryTransactions
                .Where(t => t.Type == "OUT" && t.CreatedAt >= today)
                .SumAsync(t => t.Quantity);

            var stockInThisWeek = await _context.InventoryTransactions
                .Where(t => t.Type == "IN" && t.CreatedAt >= weekStart)
                .SumAsync(t => t.Quantity);

            var stockOutThisWeek = await _context.InventoryTransactions
                .Where(t => t.Type == "OUT" && t.CreatedAt >= weekStart)
                .SumAsync(t => t.Quantity);

            return Ok(new
            {
                StockInToday = stockInToday,
                StockOutToday = stockOutToday,
                StockInThisWeek = stockInThisWeek,
                StockOutThisWeek = stockOutThisWeek
            });
        }
        [HttpGet("report")]
        public async Task<IActionResult> GetInventoryReport()
        {
            var report = await _context.Products
                .Where(p => p.IsActive)
                .Select(p => new
                {
                    ProductName = p.Name,
                    Stock = p.StockQuantity,
                    CostPrice = p.CostPrice,
                    InventoryValue = p.StockQuantity * p.CostPrice
                })
                .ToListAsync();

            return Ok(report);
        }
    }
}