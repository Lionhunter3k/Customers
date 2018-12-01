using Customers.Domain.Core;
using Infrastructure.Model;
using System;
using System.ComponentModel.DataAnnotations;

namespace Customers.Api.Models
{
    public class CustomerUpsertModel : IRootModel<Customer>
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Email is invalid")]
        [DataType(DataType.EmailAddress)]
        [StringLength(50, ErrorMessage = "Email can't exceed 50 characters")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [DataType(DataType.Text)]
        [StringLength(50, ErrorMessage = "Name can't exceed 50 characters")]
        public string Name { get; set; }

        [RegularExpression(@"([0-9 \.\(\)/\\\-\+])+", ErrorMessage = "Letters are not allowed")]
        [DataType(DataType.PhoneNumber)]
        [StringLength(20, ErrorMessage = "PhoneNumber can't exceed 20 characters")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "DateOfBirth is required")]
        [DataType(DataType.Date)]
        public DateTime? DateOfBirth { get; set; }

        public AddressUpsertModel LastAddress { get; set; }
    }

    public class AddressUpsertModel
    {
        [Required(ErrorMessage = "Street is required")]
        [DataType(DataType.Text)]
        [StringLength(200, ErrorMessage = "Street can't exceed 200 characters")]
        public string Street { get; set; }

        [Required(ErrorMessage = "Town is required")]
        [DataType(DataType.Text)]
        [StringLength(200, ErrorMessage = "Town can't exceed 200 characters")]
        public string Town { get; set; }

        [Required(ErrorMessage = "ZipCode is required")]
        [DataType(DataType.Text)]
        [StringLength(10, ErrorMessage = "ZipCode can't exceed 10 characters")]
        public string ZipCode { get; set; }

        [Required(ErrorMessage = "Country is required")]
        [DataType(DataType.Text)]
        [StringLength(50, ErrorMessage = "Country can't exceed 50 characters")]
        public string Country { get; set; }
    }
}
