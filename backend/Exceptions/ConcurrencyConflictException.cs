namespace InternshipManagement.Api.Exceptions;

public class ConcurrencyConflictException : Exception
{
    public ConcurrencyConflictException(string message)
        : base(message)
    {
    }
}