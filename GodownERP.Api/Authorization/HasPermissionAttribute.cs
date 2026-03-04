using GodownERP.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GodownERP.Api.Authorization
{
    public class HasPermissionAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        private readonly string _permission;

        public HasPermissionAttribute(string permission)
        {
            _permission = permission;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var userIdClaim = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)
                               ?? context.HttpContext.User.FindFirst("sub");

            if (userIdClaim == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var dbContext = context.HttpContext.RequestServices
                .GetService(typeof(AppDbContext)) as AppDbContext;

            if (dbContext == null)
            {
                context.Result = new StatusCodeResult(500);
                return;
            }

            var userId = Guid.Parse(userIdClaim.Value);

            var hasPermission = dbContext.UserRoles
                .Where(ur => ur.UserId == userId)
                .Join(dbContext.RolePermissions,
                      ur => ur.RoleId,
                      rp => rp.RoleId,
                      (ur, rp) => rp)
                .Join(dbContext.Permissions,
                      rp => rp.PermissionId,
                      p => p.Id,
                      (rp, p) => p.Name)
                .Any(p => p == _permission);

            if (!hasPermission)
            {
                context.Result = new ForbidResult();
            }
        }
    }
}