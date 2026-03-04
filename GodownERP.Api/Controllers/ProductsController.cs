using GodownERP.Domain.Entities;
using GodownERP.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GodownERP.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // ---------------------------
        // CREATE Product
        // ---------------------------
        [HttpPost]
        public async Task<IActionResult> CreateProduct(Product product)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var vendorExists = await _context.Vendors
                .AnyAsync(v => v.Id == product.VendorId && v.IsActive);

            if (!vendorExists)
                return BadRequest("Invalid VendorId");

            var skuExists = await _context.Products
                .AnyAsync(p => p.SKU == product.SKU && p.IsActive);

            if (skuExists)
                return BadRequest("SKU already exists");

            product.CreatedAt = DateTime.UtcNow;
            product.IsActive = true;

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        // ---------------------------
        // GET All Products
        // ---------------------------
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _context.Products
                .Include(p => p.Vendor)
                .Where(p => p.IsActive)
                .ToListAsync();

            return Ok(products);
        }

        // ---------------------------
        // GET Product By Id
        // ---------------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(Guid id)
        {
            var product = await _context.Products
                .Include(p => p.Vendor)
                .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // ---------------------------
        // UPDATE Product
        // ---------------------------
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(Guid id, Product updatedProduct)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null || !product.IsActive)
                return NotFound();

            product.Name = updatedProduct.Name;
            product.SKU = updatedProduct.SKU;
            product.Price = updatedProduct.Price;
            product.CostPrice = updatedProduct.CostPrice;
            product.StockQuantity = updatedProduct.StockQuantity;
            product.VendorId = updatedProduct.VendorId;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(product);
        }

        // ---------------------------
        // SOFT DELETE Product
        // ---------------------------
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null || !product.IsActive)
                return NotFound();

            product.IsActive = false;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok("Product deactivated successfully");
        }
        // ---------------------------
        // INCREASE STOCK
        // ---------------------------
        [HttpPost("{id}/increase-stock")]
        public async Task<IActionResult> IncreaseStock(Guid id, [FromQuery] int quantity)
        {
            if (quantity <= 0)
                return BadRequest("Quantity must be greater than 0");

            var product = await _context.Products.FindAsync(id);

            if (product == null || !product.IsActive)
                return NotFound();

            product.StockQuantity += quantity;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { product.Id, product.StockQuantity });
        }
        // ---------------------------
        // DECREASE STOCK
        // ---------------------------
        [HttpPost("{id}/decrease-stock")]
        public async Task<IActionResult> DecreaseStock(Guid id, [FromQuery] int quantity)
        {
            if (quantity <= 0)
                return BadRequest("Quantity must be greater than 0");

            var product = await _context.Products.FindAsync(id);

            if (product == null || !product.IsActive)
                return NotFound();

            if (product.StockQuantity < quantity)
                return BadRequest("Insufficient stock");

            product.StockQuantity -= quantity;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { product.Id, product.StockQuantity });
        }
    }
}