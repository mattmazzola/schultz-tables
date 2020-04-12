using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Azure.Documents.Client;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SchultzTablesService.Options;

namespace SchultzTablesService
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            if (env.IsDevelopment())
            {
                builder.AddUserSecrets<Startup>();
            }

            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<MvcOptions>(options =>
            {
                options.Filters.Add(new RequireHttpsAttribute());
            });


            services.AddCors();
            services.AddMvc();
            services.AddDataProtection();
            services.Configure<DocumentDbOptions>(Configuration.GetSection("DocumentDb"));
            services.Configure<AadB2cApplicationOptions>(Configuration.GetSection("AadB2cApplication"));

            services.AddSingleton<DocumentClient>(serviceProvider =>
            {
                var documentDbOptions = serviceProvider.GetRequiredService<IOptions<DocumentDbOptions>>();
                return new DocumentClient(new Uri(documentDbOptions.Value.AccountUri), documentDbOptions.Value.AccountKey);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            var options = new RewriteOptions()
               .AddRedirectToHttps();

            app.UseRewriter(options);

            app.UseCors(builder => builder.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin());
            app.Use(async (request, next) =>
            {
                await next();
            });
            app.UseJwtBearerAuthentication(new JwtBearerOptions()
            {
                Audience = "a45a80e6-7fc7-4919-8685-ab9923a850a1",
                MetadataAddress = "https://login.microsoftonline.com/schultztables.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_signinfb",
                TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    ValidateIssuerSigningKey = true
                }
            });
            app.UseMvc();

        }
    }
}
