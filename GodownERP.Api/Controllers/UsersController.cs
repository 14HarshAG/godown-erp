using BCrypt.Net;
using GodownERP.Application.Requests;
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
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // ---------------------------
        // GET ALL USERS
        // ---------------------------
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .Where(u => u.IsActive)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.CreatedAt,
                    Role = _context.UserRoles
                        .Where(ur => ur.UserId == u.Id)
                        .Select(ur => ur.Role.Name)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(users);
        }

        // ---------------------------
        // CREATE USER
        // ---------------------------
        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateUserRequest request)
        {
            try
            {
                // find role first
                var role = await _context.Roles
                    .FirstOrDefaultAsync(r => r.Name == request.RoleName);

                if (role == null)
                    return BadRequest("Invalid role");

                var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

                var user = new User
                {
                    Id = Guid.NewGuid(),
                    FullName = request.FullName,
                    Email = request.Email,
                    PasswordHash = passwordHash,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                var userRole = new UserRole
                {
                    UserId = user.Id,
                    RoleId = role.Id
                };

                // add both
                _context.Users.Add(user);
                _context.UserRoles.Add(userRole);

                // save once
                await _context.SaveChangesAsync();

                return Ok(new { message = "User created successfully", user });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // ---------------------------
        // UPDATE USER
        // ---------------------------
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, UpdateUserRequest request)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            user.FullName = request.FullName;
            user.Email = request.Email;
            user.IsActive = request.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(user);
        }

        // ---------------------------
        // DELETE USER (SOFT DELETE)
        // ---------------------------
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null || !user.IsActive)
                return NotFound();

            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok("User deactivated successfully");
        }

        // ---------------------------
        // ASSIGN ROLE TO USER
        // ---------------------------
        [HttpPost("{id}/assign-role")]
        public async Task<IActionResult> AssignRole(Guid id, AssignRoleRequest request)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound("User not found");

            var role = await _context.Roles.FindAsync(request.RoleId);

            if (role == null)
                return NotFound("Role not found");

            var userRole = new UserRole
            {
                UserId = id,
                RoleId = request.RoleId
            };

            _context.UserRoles.Add(userRole);

            await _context.SaveChangesAsync();

            return Ok("Role assigned successfully");
        }
    }

    // ---------------------------
    // REQUEST MODELS
    // ---------------------------

    public class CreateUserRequest
    {
        public string FullName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string RoleName { get; set; }   // 🔹 Added
    }

    public class UpdateUserRequest
    {
        public string FullName { get; set; }

        public string Email { get; set; }

        public bool IsActive { get; set; }
    }
}