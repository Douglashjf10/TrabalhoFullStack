using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace sistema_marcacao_consultas.Services
{
    public class JwtTokenService
    {
        private readonly string _secretKey;

        public JwtTokenService(string secretKey)
        {
            _secretKey = secretKey;
        }

        public string GenerateToken(int userId, string role)
        {
            if (string.IsNullOrEmpty(role))
                throw new ArgumentException("Role is required to generate token.");

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "consultasApi",
                audience: "consultasApi",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

