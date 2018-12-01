using Infrastructure.Queries;
using System;
using System.ComponentModel.DataAnnotations;

namespace Customers.Queries.Model
{
    public class CustomerListRequestModel : IRequest<CustomerListModel>
    {
        [DataType(DataType.EmailAddress)]
        [StringLength(50, ErrorMessage = "Email can't exceed 50 characters")]
        public string Email { get; set; }

        [DataType(DataType.Text)]
        [StringLength(50, ErrorMessage = "Name can't exceed 50 characters")]
        public string Name { get; set; }

        [RegularExpression(@"([0-9 \.\(\)/\\\-\+])+", ErrorMessage = "Letters are not allowed")]
        [DataType(DataType.PhoneNumber)]
        [StringLength(50, ErrorMessage = "PhoneNumber can't exceed 50 characters")]
        public string PhoneNumber { get; set; }

        [DataType(DataType.Date)]
        public DateTime? MinDateOfBirth { get; set; }

        [DataType(DataType.Date)]
        public DateTime? MaxDateOfBirth { get; set; }
    }
}
