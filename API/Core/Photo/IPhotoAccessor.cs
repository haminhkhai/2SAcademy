﻿using API.DTO;

namespace API.Core.Photo;

public interface IPhotoAccessor
{
    Task<PhotoUploadResult> AddPhoto(IFormFile file);
    Task<string> DeletePhoto(string publicId);
    PhotoSignature GetSignature(string preset);
}
