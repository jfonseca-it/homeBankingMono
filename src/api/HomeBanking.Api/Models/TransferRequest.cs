using System.ComponentModel.DataAnnotations;

namespace HomeBanking.Api.Models;

public class TransferRequest
{
    [Required]
    public int FromAccountId { get; set; }
    
    [Required]
    public int ToAccountId { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Description { get; set; } = string.Empty;
}
