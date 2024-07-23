using API.Core.Photo;
using API.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/photo")]
public class PhotoController : ControllerBase
{
    private readonly IPhotoAccessor _photoAccessor;

    public PhotoController(IPhotoAccessor photoAccessor)
    {
        _photoAccessor = photoAccessor;
    }

    [HttpGet("GetSignature/{preset}")]
    public ActionResult<PhotoSignature> GetSignature(string preset)
    {
        var signature = _photoAccessor.GetSignature(preset);
        if (signature is null) return null;
        return Ok(signature);
    }

    [HttpDelete("{publicId}")]
    public async Task<ActionResult> DeletePhoto(string publicId)
    {
        var decodedPublicId = Uri.UnescapeDataString(publicId);

        var result = await _photoAccessor.DeletePhoto(decodedPublicId);
        if (result == null) return BadRequest("Problem deleting photo from Cloudinary, if this photo had been deleted before ignore this error");
        return Ok();
    }
}
