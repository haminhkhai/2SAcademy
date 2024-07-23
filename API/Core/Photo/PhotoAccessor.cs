using API.DTO;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Core.Photo;

public class PhotoAccessor : IPhotoAccessor
{
    private readonly Cloudinary _cloudinary;
    // public PhotoAccessor(string cloudinaryUrl)
    // {
    //     _cloudinary = new Cloudinary(cloudinaryUrl);
    //     _cloudinary.Api.Secure = true;
    // }

    public PhotoAccessor(IOptions<CloudinarySettings> config)
    {
        var account = new Account(
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
        );
        _cloudinary = new Cloudinary(account);
    }

    public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
    {
        if (file.Length > 0)
        {
            await using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream)
            };
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
            {
                throw new Exception(uploadResult.Error.Message);
            }

            return new PhotoUploadResult
            {
                PublicId = uploadResult.PublicId,
                Url = uploadResult.SecureUrl.ToString()
            };
        }
        return null;
    }

    public async Task<string> DeletePhoto(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        var result = await _cloudinary.DestroyAsync(deleteParams);
        return result.Result == "ok" ? result.Result : null;
    }

    public PhotoSignature GetSignature(string preset)
    {
        //UNIX timestamp
        //total number of seconds that have elapsed since 00:00:00 
        //1-1-1970, not counting leap seconds
        var timestamp = (int)DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;
        var parameters = new SortedDictionary<string, object>
            {
                { "timestamp", timestamp },
                { "upload_preset", preset }
            };
        var signature = _cloudinary.Api.SignParameters(parameters);
        return new PhotoSignature() { Signature = signature, Timestamp = timestamp };
    }
}
