export interface Artist {
    id: string;
    name: string;
    description: string;
    thumbUrl: string;
    thumbPublicId: string;
}

export class Artist implements Artist {
    id = "";
    name = "";
    description = "";
    thumbUrl = "";
    thumbPublicId = "";
    constructor (artist?: Artist) {
        if (artist) {
            Object.assign(this, artist);
        }
    }
}

export class ArtistOptions {
    text = "";
    value = "";
    constructor(artist?: Artist, text?: string, value?: string) {
        if (artist) {
            this.text = artist.name;
            this.value = artist.id;
        }
        if (text && value) {
            this.text = text;
            this.value = value;
        }
    }
}