using System;

namespace GodownERP.Application.Authentication
{
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;

        public DateTime Expiration { get; set; }
    }
}