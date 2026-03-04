using System;

namespace GodownERP.Domain.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;

        public string SKU { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public decimal CostPrice { get; set; }

        public int StockQuantity { get; set; }

        // Foreign Key
        public Guid VendorId { get; set; }

        public Vendor? Vendor { get; set; }
    }
}