using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GodownERP.Domain.Entities
{
    public class InventoryTransaction
    {
        public Guid Id { get; set; }

        // Product reference
        public Guid ProductId { get; set; }
        public Product Product { get; set; }

        // Quantity moved
        public int Quantity { get; set; }

        // IN or OUT
        public string Type { get; set; }

        // Time of transaction
        public DateTime CreatedAt { get; set; }

        // User who performed action
        public Guid UserId { get; set; }
        public User User { get; set; }
    }
}