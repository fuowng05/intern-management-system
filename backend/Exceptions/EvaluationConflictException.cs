namespace InternshipManagement.Api.Exceptions;

public class EvaluationConflictException : Exception
{
    public string Code { get; }

    public EvaluationConflictException(
        string code,
        string message)
        : base(message)
    {
        Code = code;
    }
}