namespace API.DTO;

public class PhotoUploadResult
{
    public string PublicId { get; set; }
    public string Url { get; set; }
}

public class PhotoSignature {
    public string Signature { get; set; }
    public int Timestamp { get; set; }
}