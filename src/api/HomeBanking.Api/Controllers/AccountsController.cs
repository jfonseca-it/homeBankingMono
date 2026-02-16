using HomeBanking.Api.Data;
using HomeBanking.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeBanking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly BankingContext _context;
    private readonly ILogger<AccountsController> _logger;

    public AccountsController(BankingContext context, ILogger<AccountsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all accounts
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Account>>> GetAccounts()
    {
        return await _context.Accounts.ToListAsync();
    }

    /// <summary>
    /// Get account by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Account>> GetAccount(int id)
    {
        var account = await _context.Accounts.FindAsync(id);

        if (account == null)
        {
            return NotFound();
        }

        return account;
    }
}
