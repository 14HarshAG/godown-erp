using GodownERP.Domain.Entities;
using GodownERP.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GodownERP.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // All vendor endpoints require login
    public class VendorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VendorsController(AppDbContext context)
        {
            _context = context;
        }

        // ---------------------------
        // CREATE Vendor
        // ---------------------------
        [HttpPost]
        public async Task<IActionResult> CreateVendor(Vendor vendor)
        {
            vendor.CreatedAt = DateTime.UtcNow;
            vendor.IsActive = true;

            _context.Vendors.Add(vendor);
            await _context.SaveChangesAsync();

            return Ok(vendor);
        }

        // ---------------------------
        // GET All Vendors
        // ---------------------------
        [HttpGet]
        public async Task<IActionResult> GetAllVendors()
        {
            var vendors = await _context.Vendors
                .Where(v => v.IsActive)
                .ToListAsync();

            return Ok(vendors);
        }

        // ---------------------------
        // GET Vendor By Id
        // ---------------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVendorById(Guid id)
        {
            var vendor = await _context.Vendors
                .FirstOrDefaultAsync(v => v.Id == id && v.IsActive);

            if (vendor == null)
                return NotFound();

            return Ok(vendor);
        }

        // ---------------------------
        // UPDATE Vendor
        // ---------------------------
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVendor(Guid id, Vendor updatedVendor)
        {
            var vendor = await _context.Vendors.FindAsync(id);

            if (vendor == null || !vendor.IsActive)
                return NotFound();

            vendor.Name = updatedVendor.Name;
            vendor.Email = updatedVendor.Email;
            vendor.Phone = updatedVendor.Phone;
            vendor.Address = updatedVendor.Address;
            vendor.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(vendor);
        }

        // ---------------------------
        // SOFT DELETE Vendor
        // ---------------------------
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVendor(Guid id)
        {
            var vendor = await _context.Vendors.FindAsync(id);

            if (vendor == null || !vendor.IsActive)
                return NotFound();

            vendor.IsActive = false;
            vendor.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok("Vendor deactivated successfully");
        }
        
    }
}


