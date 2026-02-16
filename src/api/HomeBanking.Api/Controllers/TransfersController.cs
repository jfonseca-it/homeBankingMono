using HomeBanking.Api.Data;
using HomeBanking.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeBanking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransfersController : ControllerBase
{
    private readonly BankingContext _context;
    private readonly ILogger<TransfersController> _logger;

    public TransfersController(BankingContext context, ILogger<TransfersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Create a new transfer between accounts
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> CreateTransfer([FromBody] TransferRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var fromAccount = await _context.Accounts.FindAsync(request.FromAccountId);
        var toAccount = await _context.Accounts.FindAsync(request.ToAccountId);

        if (fromAccount == null || toAccount == null)
        {
            return BadRequest(new { message = "One or both accounts not found" });
        }

        if (fromAccount.Id == toAccount.Id)
        {
            return BadRequest(new { message = "Cannot transfer to the same account" });
        }

        if (fromAccount.Balance < request.Amount)
        {
            return BadRequest(new { message = "Insufficient funds" });
        }

        // Update balances
        fromAccount.Balance -= request.Amount;
        toAccount.Balance += request.Amount;

        // Create debit transaction
        var debitTransaction = new Transaction
        {
            AccountId = request.FromAccountId,
            Type = "Debit",
            Amount = request.Amount,
            Description = $"Transfer to {toAccount.AccountNumber}: {request.Description}",
            Category = "Transfer",
            Date = DateTime.UtcNow,
            Reference = $"TRF{Guid.NewGuid().ToString("N")[..8].ToUpper()}"
        };

        // Create credit transaction
        var creditTransaction = new Transaction
        {
            AccountId = request.ToAccountId,
            Type = "Credit",
            Amount = request.Amount,
            Description = $"Transfer from {fromAccount.AccountNumber}: {request.Description}",
            Category = "Transfer",
            Date = DateTime.UtcNow,
            Reference = debitTransaction.Reference
        };

        _context.Transactions.Add(debitTransaction);
        _context.Transactions.Add(creditTransaction);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Transfer completed: {Amount} from Account {FromId} to Account {ToId}", 
            request.Amount, request.FromAccountId, request.ToAccountId);

        return Ok(new
        {
            message = "Transfer completed successfully",
            reference = debitTransaction.Reference,
            fromAccount = new { id = fromAccount.Id, balance = fromAccount.Balance },
            toAccount = new { id = toAccount.Id, balance = toAccount.Balance }
        });
    }
}
