using Mailman.Services.Data;
using Mailman.Services.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mailman.Services
{
    public static class ApplicationBuilderExtensions
    {
        public static void UseMailmanAuthentication(this IApplicationBuilder app)
        {
            app.UseAuthentication();
            app.UseAuthorization();
            app.Use(async (context, next) =>
            {
                Task ensureTokensUpdatedTask;
                bool isOK = true;

                bool? isAuthenticated = context.User.Identity?.IsAuthenticated;
                if (isAuthenticated.HasValue && isAuthenticated.Value)
                {
                    var authService = context.RequestServices.GetRequiredService<IAuthenticationService>();
                    var auth = await authService.AuthenticateAsync(context, CookieAuthenticationDefaults.AuthenticationScheme);
                    if (!auth.Succeeded)
                    {
                        auth = await authService.AuthenticateAsync(context, JwtBearerDefaults.AuthenticationScheme);
                    }

                    if (!auth.Succeeded)
                    {
                        context.Response.StatusCode = 500;
                        await context.Response.WriteAsync("Failed updating tokens.");
                        isOK = false;
                    }

                    // we'll update the tokens asynchronously so as not to slow down the main asp.net pipeline
                    ensureTokensUpdatedTask = context.RequestServices
                        .GetRequiredService<IGoogleOAuthTokenService>()
                        .UpdateOAuthTokens(auth);
                }
                else
                    ensureTokensUpdatedTask = Task.CompletedTask;

                if (isOK)
                {
                    await Task.WhenAll(ensureTokensUpdatedTask, next.Invoke());
                }
            });
        }

        public static void EnsureMailmanDbCreated(this IApplicationBuilder app)
        {
            using (var scope = app.ApplicationServices.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<MergeTemplateContext>();
                dbContext.Database.Migrate();
                var oauthContext = scope.ServiceProvider.GetRequiredService<OAuthTokenContext>();
                oauthContext.Database.Migrate();
            }

        }
    }
}
