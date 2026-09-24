using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using InternshipManagement.Api.Configuration;
using InternshipManagement.Api.Data;
using InternshipManagement.Api.Services;
using Microsoft.EntityFrameworkCore;
using InternshipManagement.Api.Authorization;
using Microsoft.AspNetCore.Authorization;
using InternshipManagement.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
// =========================
// DATABASE
// =========================
var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    ));

// =========================
// CONTROLLERS
// =========================
builder.Services.AddControllers();

// =========================
// JWT SETTINGS
// =========================
var jwtSettings = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>()!;

builder.Services.AddSingleton(jwtSettings);

// =========================
// SERVICES
// =========================
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();

builder.Services.AddScoped<
    IInternshipPeriodService,
    InternshipPeriodService>();

builder.Services.AddScoped<
    IApplicationService,
    ApplicationService>();

builder.Services.AddScoped<
    IAssignmentService,
    AssignmentService>();

builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<
    ICriteriaTemplateService,
    CriteriaTemplateService>();
    
builder.Services.AddScoped<
    IEvaluationService,
    EvaluationService>();

builder.Services.AddScoped<
    IAuditLogService,
    AuditLogService>();

builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IReportService, ReportService>();
        
// =========================
// AUTHENTICATION - JWT
// =========================
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,

                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtSettings.Key)
                )
            };
    });

// =========================
// AUTHORIZATION
// =========================
builder.Services.AddAuthorization(options =>
{
    var permissions = new[]
    {
        "APPLICATION_CREATE",
        "APPLICATION_VIEW_SELF",
        "APPLICATION_VIEW_ALL",
        "APPLICATION_DECIDE",

        "ASSIGNMENT_CREATE",
        "ASSIGNMENT_VIEW_SELF",
        "ASSIGNMENT_VIEW_ALL",

        "EVALUATION_VIEW_SELF",
        "EVALUATION_VIEW_ALL",
       
        "INTERNSHIP_PERIOD_VIEW",
        "INTERNSHIP_PERIOD_MANAGE",
        
        "COMPANY_VIEW",
        "COMPANY_MANAGE",

        "CRITERIA_TEMPLATE_VIEW",
        "CRITERIA_TEMPLATE_MANAGE",

        "EVALUATION_SCORE",
        "EVALUATION_SUBMIT",
        "EVALUATION_REVIEW",
        "EVALUATION_RETURN",
        "EVALUATION_PUBLISH",

        "RESULT_VIEW_SELF",

        "AUDIT_VIEW",
        "RBAC_MANAGE",

        "DASHBOARD_VIEW",
        "REPORT_VIEW"
    };

    foreach (var permission in permissions)
    {
        options.AddPolicy(
            permission,
            policy =>
            {
                policy.RequireAuthenticatedUser();

                policy.AddRequirements(
                    new PermissionRequirement(permission));
            });
    }
});

builder.Services.AddSingleton<
    IAuthorizationHandler,
    PermissionAuthorizationHandler>();
// =========================
// SWAGGER
// =========================
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "InternshipManagement.Api",
            Version = "v1"
        }
    );

    // Khai báo JWT Bearer cho Swagger
    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description =
                "Nhập JWT token nhận được sau khi đăng nhập."
        }
    );

    // Áp dụng Bearer Authentication
    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        }
    );
});

var app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();

// =========================
// SWAGGER
// =========================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint(
            "/swagger/v1/swagger.json",
            "InternshipManagement.Api v1"
        );
    });
}

// =========================
// MIDDLEWARE
// =========================
// app.UseHttpsRedirection();
app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();