using HomeBanking.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeBanking.Api.Data;

public class BankingContext : DbContext
{
    public BankingContext(DbContextOptions<BankingContext> options) : base(options)
    {
    }

    public DbSet<Account> Accounts { get; set; }
    public DbSet<Transaction> Transactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed 3 accounts
        modelBuilder.Entity<Account>().HasData(
            new Account
            {
                Id = 1,
                AccountNumber = "1000001",
                AccountHolder = "John Doe",
                Balance = 5000.00m,
                Currency = "USD",
                CreatedAt = new DateTime(2024, 1, 1)
            },
            new Account
            {
                Id = 2,
                AccountNumber = "1000002",
                AccountHolder = "Jane Smith",
                Balance = 7500.50m,
                Currency = "USD",
                CreatedAt = new DateTime(2024, 1, 15)
            },
            new Account
            {
                Id = 3,
                AccountNumber = "1000003",
                AccountHolder = "Bob Johnson",
                Balance = 3200.75m,
                Currency = "USD",
                CreatedAt = new DateTime(2024, 2, 1)
            }
        );

        // Seed 20 transactions
        var random = new Random(42); // Fixed seed for consistency
        var categories = new[] { "Groceries", "Utilities", "Entertainment", "Shopping", "Dining", "Transportation", "Healthcare", "Education" };
        var types = new[] { "Credit", "Debit" };
        var descriptions = new Dictionary<string, string[]>
        {
            ["Groceries"] = new[] { "Supermarket Purchase", "Fresh Market", "Grocery Store" },
            ["Utilities"] = new[] { "Electric Bill", "Water Bill", "Internet Service" },
            ["Entertainment"] = new[] { "Movie Tickets", "Concert", "Streaming Service" },
            ["Shopping"] = new[] { "Online Purchase", "Retail Store", "Electronics" },
            ["Dining"] = new[] { "Restaurant", "Coffee Shop", "Fast Food" },
            ["Transportation"] = new[] { "Gas Station", "Public Transit", "Uber" },
            ["Healthcare"] = new[] { "Pharmacy", "Doctor Visit", "Health Insurance" },
            ["Education"] = new[] { "Online Course", "Books", "Tuition" }
        };

        var transactions = new List<Transaction>();
        var transactionId = 1;
        var startDate = new DateTime(2024, 2, 1);

        for (int accountId = 1; accountId <= 3; accountId++)
        {
            for (int i = 0; i < 7; i++)
            {
                var category = categories[random.Next(categories.Length)];
                var type = types[random.Next(types.Length)];
                var amount = Math.Round((decimal)(random.NextDouble() * 500 + 10), 2);
                var descArray = descriptions[category];
                var description = descArray[random.Next(descArray.Length)];

                transactions.Add(new Transaction
                {
                    Id = transactionId++,
                    AccountId = accountId,
                    Type = type,
                    Amount = amount,
                    Description = description,
                    Category = category,
                    Date = startDate.AddDays(random.Next(45)),
                    Reference = $"TXN{transactionId:D6}"
                });
            }
        }

        // Ensure we have exactly 20 transactions (21 total)
        transactions.Add(new Transaction
        {
            Id = transactionId,
            AccountId = 1,
            Type = "Credit",
            Amount = 1000.00m,
            Description = "Salary Deposit",
            Category = "Income",
            Date = startDate.AddDays(15),
            Reference = $"TXN{transactionId:D6}"
        });

        modelBuilder.Entity<Transaction>().HasData(transactions);
    }
}
