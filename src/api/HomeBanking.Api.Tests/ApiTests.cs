using System.Net;
using System.Net.Http.Json;
using HomeBanking.Api.Data;
using HomeBanking.Api.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;

namespace HomeBanking.Api.Tests;

public class TestWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override IHost CreateHost(IHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            services.RemoveAll(typeof(DbContextOptions<BankingContext>));
            services.AddDbContext<BankingContext>(options =>
            {
                options.UseInMemoryDatabase("TestDb");
            });
        });

        return base.CreateHost(builder);
    }
}

public class AccountsControllerTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory _factory;

    public AccountsControllerTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAccounts_ReturnsSuccessAndAccounts()
    {
        // Act
        var response = await _client.GetAsync("/api/accounts");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var accounts = await response.Content.ReadFromJsonAsync<List<Account>>();
        Assert.NotNull(accounts);
        Assert.True(accounts.Count >= 3);
    }

    [Fact]
    public async Task GetAccount_WithValidId_ReturnsAccount()
    {
        // Act
        var response = await _client.GetAsync("/api/accounts/1");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var account = await response.Content.ReadFromJsonAsync<Account>();
        Assert.NotNull(account);
        Assert.Equal(1, account.Id);
    }

    [Fact]
    public async Task GetAccount_WithInvalidId_ReturnsNotFound()
    {
        // Act
        var response = await _client.GetAsync("/api/accounts/999");
        
        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}

public class TransactionsControllerTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public TransactionsControllerTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetTransactions_ReturnsSuccessAndTransactions()
    {
        // Act
        var response = await _client.GetAsync("/api/transactions");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var transactions = await response.Content.ReadFromJsonAsync<List<Transaction>>();
        Assert.NotNull(transactions);
        Assert.True(transactions.Count >= 20);
    }

    [Fact]
    public async Task GetTransactionsByAccount_ReturnsTransactionsForAccount()
    {
        // Act
        var response = await _client.GetAsync("/api/transactions/account/1");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var transactions = await response.Content.ReadFromJsonAsync<List<Transaction>>();
        Assert.NotNull(transactions);
        Assert.All(transactions, t => Assert.Equal(1, t.AccountId));
    }
}

public class TransfersControllerTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public TransfersControllerTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateTransfer_WithValidRequest_ReturnsSuccess()
    {
        // Arrange
        var request = new TransferRequest
        {
            FromAccountId = 1,
            ToAccountId = 2,
            Amount = 100.00m,
            Description = "Test transfer"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/transfers", request);
        
        // Assert
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task CreateTransfer_WithInsufficientFunds_ReturnsBadRequest()
    {
        // Arrange
        var request = new TransferRequest
        {
            FromAccountId = 1,
            ToAccountId = 2,
            Amount = 999999.00m,
            Description = "Test transfer"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/transfers", request);
        
        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateTransfer_WithSameAccount_ReturnsBadRequest()
    {
        // Arrange
        var request = new TransferRequest
        {
            FromAccountId = 1,
            ToAccountId = 1,
            Amount = 100.00m,
            Description = "Test transfer"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/transfers", request);
        
        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}

public class HealthCheckTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public HealthCheckTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task HealthCheck_ReturnsHealthy()
    {
        // Act
        var response = await _client.GetAsync("/health");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.Equal("Healthy", content);
    }
}
