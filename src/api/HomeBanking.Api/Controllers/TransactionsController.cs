using HomeBanking.Api.Data;
using HomeBanking.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeBanking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly BankingContext _context;
    private readonly ILogger<TransactionsController> _logger;

    public TransactionsController(BankingContext context, ILogger<TransactionsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all transactions
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
    {
        return await _context.Transactions
            .OrderByDescending(t => t.Date)
            .ToListAsync();
    }

    /// <summary>
    /// Get transactions by account ID
    /// </summary>
    [HttpGet("account/{accountId}")]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsByAccount(int accountId)
    {
        return await _context.Transactions
            .Where(t => t.AccountId == accountId)
            .OrderByDescending(t => t.Date)
            .ToListAsync();
    }

    /// <summary>
    /// Get transaction by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Transaction>> GetTransaction(int id)
    {
        var transaction = await _context.Transactions.FindAsync(id);

        if (transaction == null)
        {
            return NotFound();
        }

        return transaction;
    }
}
