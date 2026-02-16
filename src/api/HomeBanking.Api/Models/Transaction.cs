namespace HomeBanking.Api.Models;

public class Transaction
{
    public int Id { get; set; }
    public int AccountId { get; set; }
    public string Type { get; set; } = string.Empty; // Credit, Debit, Transfer
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // Groceries, Utilities, Entertainment, etc.
    public DateTime Date { get; set; }
    public string? Reference { get; set; }
    
    public Account Account { get; set; } = null!;
}
